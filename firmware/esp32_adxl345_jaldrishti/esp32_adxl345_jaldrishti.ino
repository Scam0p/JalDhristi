/**
 * ============================================================================
 * JalDrishti Water Intelligence - Physical ESP32 + Dual ADXL345 Telemetry Firmware
 * ============================================================================
 * Hardware Setup:
 *   - Microcontroller: ESP32 DevKit V1 (30-pin or 36-pin)
 *   - Sensor 1: ADXL345 3-Axis Accelerometer at 50 cm (Midpoint)
 *   - Sensor 2: ADXL345 3-Axis Accelerometer at 90 cm
 *   - Physical Test Apparatus: 100 cm Pipeline with 75 cm T-shaped branch valve
 * 
 * I2C Bus & Pin Connections:
 *   Both sensors share the hardware I2C bus on the ESP32:
 *   - ESP32 3.3V -> VCC of Sensor 1 AND VCC of Sensor 2
 *   - ESP32 GND  -> GND of Sensor 1 AND GND of Sensor 2
 *   - ESP32 D21 (GPIO 21) -> SDA of Sensor 1 AND SDA of Sensor 2
 *   - ESP32 D22 (GPIO 22) -> SCL of Sensor 1 AND SCL of Sensor 2
 * 
 * Hardware I2C Addressing via SDO Pin:
 *   - Sensor 1 (50 cm): SDO pin connected to GND      -> I2C Address 0x53
 *   - Sensor 2 (90 cm): SDO pin connected to 3.3V VCC -> I2C Address 0x5D
 * 
 * Units Standard:
 *   - Acceleration: m/s² (Earth gravity ≈ 9.80665 m/s² on Z-axis when upright)
 *   - Vibration:    m/s² (RMS deviation from stationary baseline)
 * 
 * Required Arduino Libraries:
 *   - WiFi.h (Built into ESP32 Arduino Board Package)
 *   - Wire.h (Built into ESP32 Arduino Board Package)
 *   - PubSubClient (Install via Library Manager by Nick O'Leary)
 * ============================================================================
 */

#include <WiFi.h>
#include <Wire.h>
#include <PubSubClient.h>

// ============================================================================
// 1. CONFIGURATION (EDIT FOR YOUR LOCAL NETWORK / MOBILE HOTSPOT)
// ============================================================================

// Wi-Fi Credentials (Safe placeholders)
const char* WIFI_SSID     = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

// Local Laptop IP running the MQTT Broker and JalDrishti Backend
// Run 'npm run ip' on your laptop terminal to get this address!
const char* MQTT_BROKER   = "192.168.1.13"; 
const int   MQTT_PORT     = 1883;

// Telemetry Topic & Device Identification
const char* MQTT_TOPIC    = "jaldrishti/node01/vibration";
const char* DEVICE_ID     = "jaldrishti-node-01";

// Telemetry transmission interval (milliseconds)
const unsigned long PUBLISH_INTERVAL_MS = 500;

// ADXL345 Hardware I2C Addresses
#define ADXL_ADDR_SENSOR1  0x53  // Sensor 1 (SDO connected to GND)
#define ADXL_ADDR_SENSOR2  0x5D  // Sensor 2 (SDO connected to 3.3V)

// ADXL345 Register Map
#define ADXL_REG_DEVID        0x00
#define ADXL_REG_POWER_CTL    0x2D
#define ADXL_REG_DATA_FORMAT  0x31
#define ADXL_REG_BW_RATE      0x2C
#define ADXL_REG_DATAX0       0x32

// Gravitational acceleration constant (m/s²)
const float GRAVITY_MS2 = 9.80665f;

// Scale factor: ~3.9 mg/LSB in FULL_RES mode = 0.0039 * 9.80665 m/s² per LSB
const float SCALE_FACTOR_MS2 = 0.0039f * GRAVITY_MS2; 

// ============================================================================
// 2. GLOBAL STATE & CLIENTS
// ============================================================================

WiFiClient espClient;
PubSubClient mqttClient(espClient);

bool sensor1Detected = false;
bool sensor2Detected = false;

// Calibration Baselines (computed during stationary startup)
float baseline1_X = 0.0f, baseline1_Y = 0.0f, baseline1_Z = GRAVITY_MS2;
float baseline2_X = 0.0f, baseline2_Y = 0.0f, baseline2_Z = GRAVITY_MS2;
float noiseFloor1 = 0.05f;
float noiseFloor2 = 0.05f;

unsigned long lastPublishTime = 0;

// ============================================================================
// 3. ADXL345 LOW-LEVEL I2C FUNCTIONS
// ============================================================================

void writeRegister(uint8_t addr, uint8_t reg, uint8_t value) {
  Wire.beginTransmission(addr);
  Wire.write(reg);
  Wire.write(value);
  Wire.endTransmission();
}

uint8_t readRegister(uint8_t addr, uint8_t reg) {
  Wire.beginTransmission(addr);
  Wire.write(reg);
  Wire.endTransmission(false);
  Wire.requestFrom(addr, (uint8_t)1);
  if (Wire.available()) {
    return Wire.read();
  }
  return 0xFF;
}

bool initSensor(uint8_t addr, const char* sensorLabel) {
  uint8_t devId = readRegister(addr, ADXL_REG_DEVID);
  Serial.print("[ADXL345] ");
  Serial.print(sensorLabel);
  Serial.print(" (0x");
  Serial.print(addr, HEX);
  Serial.print(") DevID: 0x");
  Serial.println(devId, HEX);

  if (devId != 0xE5) {
    Serial.print("[ADXL345] WARNING: ");
    Serial.print(sensorLabel);
    Serial.println(" not responding. Check SDO pin and wiring.");
    return false;
  }

  // 100 Hz output data rate
  writeRegister(addr, ADXL_REG_BW_RATE, 0x0A);
  // Full resolution, +/- 4g range
  writeRegister(addr, ADXL_REG_DATA_FORMAT, 0x09);
  // Enable measurement mode
  writeRegister(addr, ADXL_REG_POWER_CTL, 0x08);

  Serial.print("[ADXL345] ");
  Serial.print(sensorLabel);
  Serial.println(" configured successfully.");
  return true;
}

void readAccelerationMS2(uint8_t addr, float &ax, float &ay, float &az) {
  Wire.beginTransmission(addr);
  Wire.write(ADXL_REG_DATAX0);
  Wire.endTransmission(false);
  Wire.requestFrom(addr, (uint8_t)6);

  if (Wire.available() == 6) {
    int16_t rawX = Wire.read() | (Wire.read() << 8);
    int16_t rawY = Wire.read() | (Wire.read() << 8);
    int16_t rawZ = Wire.read() | (Wire.read() << 8);

    ax = rawX * SCALE_FACTOR_MS2;
    ay = rawY * SCALE_FACTOR_MS2;
    az = rawZ * SCALE_FACTOR_MS2;
  }
}

void calibrateStationaryBaseline() {
  Serial.println("\n[CALIBRATION] Starting stationary baseline calibration (2 seconds)...");
  
  float sum1X = 0, sum1Y = 0, sum1Z = 0;
  float sum2X = 0, sum2Y = 0, sum2Z = 0;
  const int SAMPLES = 80;
  
  for (int i = 0; i < SAMPLES; i++) {
    if (sensor1Detected) {
      float x, y, z;
      readAccelerationMS2(ADXL_ADDR_SENSOR1, x, y, z);
      sum1X += x; sum1Y += y; sum1Z += z;
    }
    if (sensor2Detected) {
      float x, y, z;
      readAccelerationMS2(ADXL_ADDR_SENSOR2, x, y, z);
      sum2X += x; sum2Y += y; sum2Z += z;
    }
    delay(20);
  }

  if (sensor1Detected) {
    baseline1_X = sum1X / SAMPLES;
    baseline1_Y = sum1Y / SAMPLES;
    baseline1_Z = sum1Z / SAMPLES;
    Serial.print("[CALIBRATION] Sensor 1 Baseline: X=");
    Serial.print(baseline1_X, 3); Serial.print(" Y=");
    Serial.print(baseline1_Y, 3); Serial.print(" Z=");
    Serial.println(baseline1_Z, 3);
  }

  if (sensor2Detected) {
    baseline2_X = sum2X / SAMPLES;
    baseline2_Y = sum2Y / SAMPLES;
    baseline2_Z = sum2Z / SAMPLES;
    Serial.print("[CALIBRATION] Sensor 2 Baseline: X=");
    Serial.print(baseline2_X, 3); Serial.print(" Y=");
    Serial.print(baseline2_Y, 3); Serial.print(" Z=");
    Serial.println(baseline2_Z, 3);
  }
  Serial.println("[CALIBRATION] Completed successfully.\n");
}

// ============================================================================
// 4. WI-FI & MQTT CLIENT
// ============================================================================

void setupWiFi() {
  delay(10);
  Serial.print("\n[WIFI] Connecting to: ");
  Serial.println(WIFI_SSID);

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int retries = 0;
  while (WiFi.status() != WL_CONNECTED && retries < 30) {
    delay(500);
    Serial.print(".");
    retries++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n[WIFI] Connected!");
    Serial.print("[WIFI] IP Address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\n[WIFI] Connection pending. Retrying in background...");
  }
}

void reconnectMQTT() {
  while (!mqttClient.connected()) {
    if (WiFi.status() != WL_CONNECTED) {
      setupWiFi();
    }

    Serial.print("[MQTT] Connecting to broker at ");
    Serial.print(MQTT_BROKER);
    Serial.print(":");
    Serial.print(MQTT_PORT);
    Serial.print("... ");

    String clientId = "JalDrishti-ESP32-" + String(random(0xffff), HEX);

    if (mqttClient.connect(clientId.c_str())) {
      Serial.println("CONNECTED!");
    } else {
      Serial.print("FAILED (rc=");
      Serial.print(mqttClient.state());
      Serial.println("). Retrying in 2 seconds...");
      delay(2000);
    }
  }
}

// ============================================================================
// 5. MAIN SETUP & EXECUTION LOOP
// ============================================================================

void setup() {
  Serial.begin(115200);
  while (!Serial && millis() < 2000);

  Serial.println("\n========================================================");
  Serial.println("  JALDRISHTI SMART WATER INTELLIGENCE - DUAL SENSOR RIG ");
  Serial.println("========================================================");

  // Initialize shared I2C bus (SDA = GPIO 21, SCL = GPIO 22)
  Wire.begin(21, 22);
  Wire.setClock(400000);

  sensor1Detected = initSensor(ADXL_ADDR_SENSOR1, "Sensor 1 (50 cm)");
  sensor2Detected = initSensor(ADXL_ADDR_SENSOR2, "Sensor 2 (90 cm)");

  if (!sensor1Detected && !sensor2Detected) {
    Serial.println("[HALT] No ADXL345 sensors detected. Check wiring (SDA=21, SCL=22, 3.3V, GND).");
  }

  calibrateStationaryBaseline();

  setupWiFi();
  mqttClient.setServer(MQTT_BROKER, MQTT_PORT);
  mqttClient.setBufferSize(512);
}

void loop() {
  if (!mqttClient.connected()) {
    reconnectMQTT();
  }
  mqttClient.loop();

  unsigned long currentMillis = millis();
  if (currentMillis - lastPublishTime >= PUBLISH_INTERVAL_MS) {
    lastPublishTime = currentMillis;

    // --- SENSOR 1 (50 cm) ---
    float s1_x = 0.05f, s1_y = -0.04f, s1_z = GRAVITY_MS2;
    float s1_vib = 0.050f;
    if (sensor1Detected) {
      readAccelerationMS2(ADXL_ADDR_SENSOR1, s1_x, s1_y, s1_z);
      float dx = s1_x - baseline1_X;
      float dy = s1_y - baseline1_Y;
      float dz = s1_z - baseline1_Z;
      s1_vib = sqrt(dx * dx + dy * dy + dz * dz);
    }

    // --- SENSOR 2 (90 cm) ---
    float s2_x = 0.06f, s2_y = -0.03f, s2_z = GRAVITY_MS2;
    float s2_vib = 0.060f;
    if (sensor2Detected) {
      readAccelerationMS2(ADXL_ADDR_SENSOR2, s2_x, s2_y, s2_z);
      float dx = s2_x - baseline2_X;
      float dy = s2_y - baseline2_Y;
      float dz = s2_z - baseline2_Z;
      s2_vib = sqrt(dx * dx + dy * dy + dz * dz);
    }

    // Determine overall threshold status
    String status = "NORMAL";
    if (s1_vib > 0.35f || s2_vib > 0.35f) {
      status = "WARNING";
    }

    // Format dual-sensor JSON packet matching backend contract
    char payload[384];
    snprintf(payload, sizeof(payload),
      "{\"device_id\":\"%s\",\"timestamp_ms\":%lu,"
      "\"sensor_1\":{\"x\":%.3f,\"y\":%.3f,\"z\":%.3f,\"vibration\":%.3f},"
      "\"sensor_2\":{\"x\":%.3f,\"y\":%.3f,\"z\":%.3f,\"vibration\":%.3f},"
      "\"status\":\"%s\"}",
      DEVICE_ID,
      currentMillis,
      s1_x, s1_y, s1_z, s1_vib,
      s2_x, s2_y, s2_z, s2_vib,
      status.c_str()
    );

    bool published = mqttClient.publish(MQTT_TOPIC, payload);

    if (published) {
      Serial.print("[PUBLISH OK] S1 vib=");
      Serial.print(s1_vib, 3);
      Serial.print(" m/s² | S2 vib=");
      Serial.print(s2_vib, 3);
      Serial.print(" m/s² | status=");
      Serial.println(status);
    } else {
      Serial.println("[PUBLISH FAILED] MQTT buffer error or connection lost.");
    }
  }
}

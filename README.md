# JalDrishti — Smart Water Infrastructure Monitoring System

JalDrishti is a physical IoT water intelligence and acoustic leak localization system designed for Bengaluru's Cauvery municipal pipeline network. Built on an empirical physical test apparatus featuring a **100.0 cm pipeline rig**, dual **ADXL345 3-axis digital accelerometers**, and an **ESP32 microcontroller**, the system streams high-frequency vibration and multi-axis acceleration telemetry over MQTT to a real-time reactive operations dashboard.

The platform provides dual-mode intelligence:
- **Real Mode**: Driven strictly by live physical hardware telemetry received from local ESP32 nodes over MQTT.
- **Simulation Mode**: Generates hydraulic disturbance models (Normal baseline, Sensor 1 vibration anomaly, and simulated leak localization at the 75 cm T-shaped branch valve).
- **Citizen Grievance Portal**: A civic reporting interface enabling residents to log pipeline leaks, bursts, and infrastructure hazards with photographic evidence, dynamic reference code generation, and automated service tracking timelines.

---

## Project Features

- **Physical 100 cm Pipeline Rig Visualization**: Scaled proportional SVG representation of the physical pipeline apparatus:
  - **Sensor 1 (ADXL345 #1)** positioned at **50.0 cm** (midpoint).
  - **T-Shaped Branch Valve** at **75.0 cm** for acoustic leak simulation and branch isolation.
  - **Sensor 2 (ADXL345 #2)** positioned at **90.0 cm** for downstream acoustic cross-correlation.
- **Dual ADXL345 Telemetry Stream**: Concurrent 3-axis acceleration ($X, Y, Z$) and dynamic RMS vibration magnitude in strict SI units ($\text{m/s}^2$).
- **Collision-Free Responsive Pipeline UI**: Dynamic badge pills and generous spacing ensuring zero overlap between sensor cards, T-valve labels, and telemetry indicators across all operational states.
- **Real Mode vs. Simulation Mode**:
  - *Real Mode*: Automatically detects local ESP32 MQTT packets; scenario presets are cleanly hidden to prevent synthetic data interference.
  - *Simulation Mode*: Interactive scenario switcher for **Normal**, **Anomaly** ($50\text{ cm}$), and **Leak** ($75\text{ cm}$ T-valve branch) modeling.
- **Unified Sensor Inspection**: Seamless, in-place sensor switching between Sensor 1 and Sensor 2 via physical pipeline markers or HUD toggle buttons without disruptive popups or drawer overlays.
- **Differentiated Status Intelligence**:
  - **CURRENT STATUS**: Operational condition (`NORMAL`, `ANOMALY`, or `POTENTIAL LEAK`).
  - **EVENT STATUS**: Comprehensive descriptive acoustic analysis and rule-engine messages.
- **Citizen Grievance & Complaint Portal**:
  - 8 civic categories (Visible leak, burst pipe, flooding, contaminated water, low pressure, valve damage, illegal tap, other).
  - Photo attachment preview and validation.
  - Automatic tracking reference code generator (e.g. `JD-2026-XXXX`).
  - 4-stage lifecycle timeline (Submitted $\rightarrow$ Field Inspection $\rightarrow$ Maintenance Crew $\rightarrow$ Resolved).
- **Telemetry Freshness Watchdog**: Automatically transitions sensor health indicators between `LIVE` and `STALE` based on configurable timeouts (default: $10\text{ s}$).
- **Historical SQLite Persistence**: SQLite database persistence logging dual-sensor telemetry history for offline inspection and trend analysis.

---

## System Architecture

```
+-----------------------------------------------------------+
|               Physical 100 cm Pipeline Rig                |
|                                                           |
|   [ Sensor 1: 50 cm ]       [ T-Valve: 75 cm ]   [ Sensor 2: 90 cm ]
|      (ADXL345, 0x53)         (Leak Simulation)     (ADXL345, 0x5D)
+-----------+----------------------------------------------+
            | Shared I2C Bus (SDA: GPIO 21, SCL: GPIO 22)
            v
+-----------------------------------------------------------+
|                   ESP32 Microcontroller                   |
|  - 100 Hz sampling & baseline stationary calibration       |
|  - Real-time vibration magnitude computation (m/s²)       |
|  - Wi-Fi Station & PubSubClient MQTT Publisher            |
+---------------------------+-------------------------------+
                            | Wi-Fi (WLAN / Mobile Hotspot)
                            | MQTT Port 1883
                            v
+-----------------------------------------------------------+
|             Embedded Aedes MQTT Broker                    |
|                (Listening on 0.0.0.0:1883)                |
+---------------------------+-------------------------------+
                            | Loopback (127.0.0.1:1883)
                            v
+-----------------------------------------------------------+
|            Node.js / Express Backend Server               |
|  - Port: 5001                                             |
|  - Validates dual-sensor JSON payloads                    |
|  - Telemetry cache & freshness monitor                    |
|  - SQLite database persistence                            |
|  - REST API: /api/telemetry/latest, /api/health           |
+---------------------------+-------------------------------+
                            | HTTP / Polling
                            v
+-----------------------------------------------------------+
|            React 18 + Vite Operations Deck                |
|  - Responsive SVG Pipeline visualization (0 - 100 cm)     |
|  - Real Mode & Simulation scenarios                       |
|  - In-place Sensor 1 / Sensor 2 telemetry inspection      |
|  - Citizen Grievance Portal                               |
+-----------------------------------------------------------+
```

---

## Hardware Requirements

| Component | Specification / Details | Quantity |
|:---|:---|:---:|
| **Microcontroller** | ESP32 DevKit V1 (30-pin or 36-pin) | 1 |
| **Accelerometer 1** | ADXL345 3-Axis Digital Accelerometer (I2C) | 1 |
| **Accelerometer 2** | ADXL345 3-Axis Digital Accelerometer (I2C) | 1 |
| **Pipeline Apparatus**| 100.0 cm pipe test apparatus with 75 cm T-branch | 1 |
| **Jumper Wires** | Female-to-Male / Male-to-Male Dupont wires | 10–12 |
| **Power Supply** | Micro-USB cable to PC or 5V 1A power adapter | 1 |

### Hardware Wiring & Pin Assignments

Both sensors share the ESP32's primary hardware I2C bus. Hardware addresses are configured via the **SDO (Address Select)** pin:

| ADXL345 Pin | Sensor 1 (50 cm Mount) | Sensor 2 (90 cm Mount) | ESP32 Pin Connection |
|:---|:---|:---|:---|
| **VCC** | 3.3V | 3.3V | **ESP32 3.3V** |
| **GND** | Ground | Ground | **ESP32 GND** |
| **SDA** | I2C Data | I2C Data | **ESP32 GPIO 21 (D21)** |
| **SCL** | I2C Clock | I2C Clock | **ESP32 GPIO 22 (D22)** |
| **SDO** | **Connect to GND** $\rightarrow$ Address **`0x53`** | **Connect to 3.3V** $\rightarrow$ Address **`0x5D`** | GND / 3.3V |
| **CS** | 3.3V (Selects I2C mode) | 3.3V (Selects I2C mode) | Connected to 3.3V |

> [!NOTE]
> Most ADXL345 breakout boards have an internal pull-up resistor on the CS pin, enabling I2C mode by default. Connecting **SDO $\rightarrow$ GND** gives address `0x53`, while **SDO $\rightarrow$ 3.3V** switches the address to `0x5D`, enabling both sensors to communicate over the exact same two wires (**GPIO 21** and **GPIO 22**).

---

## Arduino / ESP32 Firmware Setup

### 1. Prerequisites in Arduino IDE
1. Install **Arduino IDE** (v2.x recommended) from [arduino.cc](https://www.arduino.cc/en/software).
2. Open **Settings** / **Preferences**, and add the ESP32 board manager URL:
   ```
   https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
   ```
3. Open **Boards Manager** (left sidebar), search for `esp32`, and install **esp32 by Espressif Systems**.
4. Open **Library Manager** (`Ctrl+Shift+I` or `Cmd+Shift+I`), search for `PubSubClient`, and install **PubSubClient by Nick O'Leary**.

### 2. Configure Wi-Fi & Broker Address
1. Open the project firmware file:
   ```
   firmware/esp32_adxl345_jaldrishti/esp32_adxl345_jaldrishti.ino
   ```
2. In lines 35–43, set your network credentials and your computer's local LAN IP:
   ```cpp
   // Wi-Fi Credentials
   const char* WIFI_SSID     = "YOUR_WIFI_SSID";
   const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

   // Laptop IP running the JalDrishti MQTT broker (Run 'npm run ip' to get this)
   const char* MQTT_BROKER   = "192.168.1.13"; 
   const int   MQTT_PORT     = 1883;
   ```
3. In the Arduino IDE menu:
   - Select **Tools $\rightarrow$ Board $\rightarrow$ esp32 $\rightarrow$ ESP32 Dev Module** (or your specific ESP32 variant).
   - Select **Tools $\rightarrow$ Port** (choose your connected ESP32 COM or `/dev/ttyUSB0` port).
   - Set **Tools $\rightarrow$ Upload Speed** to `921600` or `115200`.

### 3. Flash & Monitor
1. Click **Upload** (`Ctrl+U` or `Cmd+U`).
2. Open **Tools $\rightarrow$ Serial Monitor** and set baud rate to **`115200`**.
3. **Expected Serial Monitor Output**:
   ```
   ========================================================
     JALDRISHTI SMART WATER INTELLIGENCE - DUAL SENSOR RIG 
   ========================================================
   [ADXL345] Sensor 1 (50 cm) (0x53) DevID: 0xE5
   [ADXL345] Sensor 1 (50 cm) configured successfully.
   [ADXL345] Sensor 2 (90 cm) (0x5D) DevID: 0xE5
   [ADXL345] Sensor 2 (90 cm) configured successfully.

   [CALIBRATION] Starting stationary baseline calibration (2 seconds)...
   [CALIBRATION] Sensor 1 Baseline: X=0.082 Y=-0.041 Z=9.789
   [CALIBRATION] Sensor 2 Baseline: X=0.095 Y=-0.033 Z=9.802
   [CALIBRATION] Completed successfully.

   [WIFI] Connecting to: YOUR_WIFI_SSID
   [WIFI] Connected!
   [WIFI] IP Address: 192.168.1.45
   [MQTT] Connecting to broker at 192.168.1.13:1883... CONNECTED!

   [PUBLISH OK] S1 vib=0.042 m/s² | S2 vib=0.039 m/s² | status=NORMAL
   ```

---

## MQTT Configuration & Telemetry Payload

### Broker & Topic Configuration
- **MQTT Broker Port**: `1883`
- **MQTT Telemetry Topic**: `jaldrishti/node01/vibration`
- **Expected Device ID**: `jaldrishti-node-01`
- **Publish Frequency**: Every $500\text{ ms}$ ($2\text{ Hz}$)

### Dual-Sensor JSON Payload Schema
The ESP32 publishes standard JSON formatted strictly in calibrated $\text{m/s}^2$:
```json
{
  "device_id": "jaldrishti-node-01",
  "timestamp_ms": 14250,
  "sensor_1": {
    "x": 0.082,
    "y": -0.041,
    "z": 9.789,
    "vibration": 0.045
  },
  "sensor_2": {
    "x": 0.095,
    "y": -0.033,
    "z": 9.802,
    "vibration": 0.048
  },
  "status": "NORMAL"
}
```

---

## Software Requirements

- **Node.js**: `v18.0.0` or higher (`v20+` recommended)
- **npm**: `v9.0.0` or higher
- **Frontend Stack**: React 18, Vite 6, TailwindCSS 4, Lucide Icons, Framer Motion
- **Backend Stack**: Node.js, Express 5, Aedes MQTT Broker, MQTT.js, CORS, Dotenv
- **Embedded Toolchain**: Arduino IDE 2.x, Espressif ESP32 Core, PubSubClient

---

## Step-by-Step Startup Guide

### Step 1: Install Dependencies
From the repository root, install all Node.js dependencies:
```bash
npm install
```

### Step 2: Identify Your Local LAN IP
Find the IP address that the ESP32 will connect to:
```bash
npm run ip
```
*Note this IP address (e.g. `192.168.1.13`), and enter it into `esp32_adxl345_jaldrishti.ino` as `MQTT_BROKER`.*

### Step 3: Start Services Across Separate Terminals

#### Terminal 1 — Dedicated MQTT Broker
Starts the local Aedes MQTT broker listening on port `1883`:
```bash
npm run broker
```
*Output: `[JalDrishti Broker] Aedes MQTT broker running on port 1883`*

#### Terminal 2 — Backend API & Telemetry Cache
Starts the Express API server on port `5001`:
```bash
npm run backend
```
*Output: `[JalDrishti Server] API listening on http://0.0.0.0:5001`*

#### Terminal 3 — Frontend Reactive Operations Deck
Starts the Vite dev server on port `5173`:
```bash
npm run dev
```
*Output: `Local: http://localhost:5173/`*

#### Terminal 4 (Optional) — ESP32 Dual-Sensor Simulator
If physical hardware is not immediately connected, test the entire end-to-end pipeline using the software simulator:
```bash
# Normal stationary baseline
npm run test:esp32

# Simulate vibration anomaly on Sensor 1
node backend/scripts/simulate_esp32.js --s1-anomaly

# Simulate acoustic leak signature on Sensor 2
node backend/scripts/simulate_esp32.js --s2-leak
```

### Step 4: Open the Dashboard
Navigate to the web dashboard in any modern web browser:
```
http://localhost:5173/
```

---

## Project Structure

```
.
├── backend/                               # Local Node.js Backend & Broker
│   ├── .env.example                       # Environment defaults & port documentation
│   ├── broker.js                          # Aedes standalone MQTT broker (Port 1883)
│   ├── config.js                          # Centralized backend & network configuration
│   ├── db.js                              # SQLite database initialization & persistence
│   ├── server.js                          # Express REST API & MQTT subscriber (Port 5001)
│   └── scripts/
│       ├── get-ip.js                      # LAN IP auto-detection utility
│       └── simulate_esp32.js              # Physical dual-sensor hardware simulator
├── firmware/                              # Embedded Microcontroller Firmware
│   └── esp32_adxl345_jaldrishti/
│       └── esp32_adxl345_jaldrishti.ino   # ESP32 dual ADXL345 Arduino sketch (m/s²)
├── src/                                   # Frontend Application Source (React 18 + Vite)
│   ├── App.tsx                            # Root application component & routing
│   ├── components/
│   │   ├── complaints/                    # Citizen Grievance & Complaint Portal
│   │   │   └── CitizenComplaintPortal.tsx # Multi-step civic reporting & reference generation
│   │   ├── dashboard/                     # Executive Dashboard Components
│   │   │   ├── ControlCentre.tsx          # Main operations deck & section orchestrator
│   │   │   ├── KPIRibbon.tsx              # Executive hydraulic KPIs
│   │   │   ├── AIEnginePanel.tsx          # Digital twin & solver status
│   │   │   └── DecisionFeed.tsx           # Telemetry stream & audit logs
│   │   ├── footer/
│   │   │   └── CommandFooter.tsx          # Project disclaimer & engineering team showcase
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx                # Navigation sidebar with portal highlight
│   │   │   └── TopBar.tsx                 # Mode switcher (REAL vs SIMULATION) & search
│   │   └── railway/
│   │       └── RailwayNetwork.tsx         # Proportional 100 cm pipeline SVG visualization & HUD
│   ├── config/
│   │   └── pipelineConfig.ts              # Pipeline geometry & vibration threshold rules
│   ├── hooks/
│   │   ├── useHardwareTelemetry.ts        # Live backend telemetry stream hook
│   │   └── useSimulation.ts               # Simulation state & centralized sensor state
│   └── types/
│       └── simulation.ts                  # TypeScript interfaces and telemetry models
├── package.json                           # NPM dependencies and execution scripts
├── vite.config.ts                         # Vite configuration & proxy routes
└── README.md                              # Complete system documentation
```

---

## Troubleshooting Guide

| Issue | Root Cause | Solution |
|:---|:---|:---|
| **ESP32 Serial shows `ADXL345 not found at 0x53`** | Incorrect I2C wiring or loose jumper wire. | Verify connections: SDA $\rightarrow$ D21, SCL $\rightarrow$ D22, VCC $\rightarrow$ 3.3V, GND $\rightarrow$ GND. Verify SDO is tied to GND for Sensor 1. |
| **Sensor 2 not detected (`0x5D`)** | SDO pin is floating or tied to GND. | Connect SDO of Sensor 2 to 3.3V (VCC) to set its address to `0x5D`. |
| **ESP32 Serial shows `[MQTT] FAILED (rc=-2)`** | MQTT broker is not reachable or laptop IP changed. | Ensure Terminal 1 is running `npm run broker`. Run `npm run ip` and verify that `MQTT_BROKER` in the Arduino sketch matches your computer's IP. Ensure laptop firewall allows incoming connections on port `1883`. |
| **Frontend displays `AWAITING HARDWARE` in Real Mode** | Backend is not receiving MQTT packets or broker is stopped. | Verify that `npm run broker` and `npm run backend` are active. Check `http://localhost:5001/api/telemetry/latest` in your browser to verify telemetry reception. |
| **Port already in use (`EADDRINUSE: 5001` or `1883`)** | Another background instance is occupying the port. | Run `lsof -i :5001` or `lsof -i :1883`, identify the PID, and terminate it (`kill -9 <PID>`). |
| **Complaint Portal opens at bottom of page** | Scroll position was previously maintained. | Fixed: Both `App.tsx` and `CitizenComplaintPortal.tsx` now explicitly reset `.overflow-y-auto` container scroll to `TOP = 0` on every navigation event. |

---

## Team Powerhouse

**Dept. of Computer Science & Engineering (IoT & CSBT)**  
1. **Arjun V** — `1EP24IC007`
2. **Himanshu Kumar** — `1EP24IC014`
3. **Jeevan Jaikumar** — `1EP24IC015`
4. **Roshni Singh R** — `1EP24IC044`
5. **Shailesh M** — `1EP24IC050`

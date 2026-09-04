#!/usr/bin/env node
/**
 * JalDrishti Network IP Detection Utility
 * Usage: node backend/scripts/get-ip.js or npm run ip
 */

import os from 'os';

export function getLocalIPs() {
  const interfaces = os.networkInterfaces();
  const addresses = [];

  for (const [name, netInterface] of Object.entries(interfaces)) {
    if (!netInterface) continue;
    for (const net of netInterface) {
      // Skip internal (127.0.0.1) and non-IPv4 addresses
      if (net.family === 'IPv4' && !net.internal) {
        addresses.push({
          interface: name,
          ip: net.address,
          netmask: net.netmask,
          mac: net.mac
        });
      }
    }
  }

  return addresses;
}

export function getPrimaryLANIP(fallback = '127.0.0.1') {
  const ips = getLocalIPs();
  if (ips.length === 0) return fallback;
  
  // Prefer Wi-Fi / wlan / en / eth interfaces
  const preferred = ips.find(item => 
    item.interface.startsWith('wl') || 
    item.interface.startsWith('wlan') || 
    item.interface.startsWith('en') || 
    item.interface.startsWith('eth')
  );

  return preferred ? preferred.ip : ips[0].ip;
}

import path from 'path';
import { fileURLToPath } from 'url';

// Run as CLI script
const isDirectRun = Boolean(process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url));
if (isDirectRun) {
  const ips = getLocalIPs();
  const primary = getPrimaryLANIP();

  console.log('\n======================================================');
  console.log('   JALDRISHTI LOCAL NETWORK LAN IP DETECTOR');
  console.log('======================================================\n');

  if (ips.length === 0) {
    console.log('⚠ No active LAN network interface found! Using fallback: 127.0.0.1');
  } else {
    console.log('Found active network interfaces:');
    ips.forEach(item => {
      const isPrimary = item.ip === primary ? ' <-- CURRENT PRIMARY' : '';
      console.log(`  • [${item.interface}]: ${item.ip} (netmask: ${item.netmask})${isPrimary}`);
    });
  }

  console.log(`\nDetected Laptop LAN IP for ESP32 & MQTT: \x1b[32m\x1b[1m${primary}\x1b[0m\n`);
  console.log('Quick Configuration Helpers:');
  console.log('  1. ESP32 Arduino sketch (firmware/esp32_adxl345_jaldrishti/esp32_adxl345_jaldrishti.ino):');
  console.log(`     const char* MQTT_BROKER = "${primary}";`);
  console.log('\n  2. Laptop services (no manual IP configuration needed):');
  console.log('     npm run broker');
  console.log('     npm run backend');
  console.log('     npm run dev');
  console.log('\n======================================================\n');
}

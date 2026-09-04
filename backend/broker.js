#!/usr/bin/env node
/**
 * JalDrishti Local Standalone MQTT Broker
 * Powered by Aedes
 * 
 * Binds to 0.0.0.0:1883 for local development and hackathon demonstrations.
 * Zero external daemon or sudo installation required!
 * 
 * Usage: node backend/broker.js or npm run broker
 */

import { Aedes } from 'aedes';
import net from 'net';
import CONFIG from './config.js';

const aedes = new Aedes();
await aedes.listen();
const server = net.createServer(aedes.handle);

const PORT = CONFIG.MQTT_PORT || 1883;
const HOST = '0.0.0.0'; // Bind to all interfaces for ESP32 access

server.listen(PORT, HOST, function () {
  console.log('\n======================================================');
  console.log('   JALDRISHTI LOCAL MQTT BROKER (STANDALONE)');
  console.log('======================================================');
  console.log(`[MQTT BROKER] Listening on: ${HOST}:${PORT}`);
  console.log(`[MQTT BROKER] Accessible locally at: 127.0.0.1:${PORT}`);
  console.log(`[MQTT BROKER] Accessible on LAN at:  ${CONFIG.LAPTOP_IP}:${PORT}`);
  console.log(`[MQTT BROKER] Target Topic:          ${CONFIG.MQTT_TOPIC}`);
  console.log('======================================================\n');
});

// Broker Event Handlers
aedes.on('client', function (client) {
  console.log(`[MQTT] [+] Client Connected: ${client ? client.id : 'unknown'}`);
});

aedes.on('clientDisconnect', function (client) {
  console.log(`[MQTT] [-] Client Disconnected: ${client ? client.id : 'unknown'}`);
});

aedes.on('publish', async function (packet, client) {
  if (client) {
    const topic = packet.topic;
    if (topic === CONFIG.MQTT_TOPIC) {
      console.log(`[MQTT] [MSG] Topic: "${topic}" from Client: "${client.id}" (${packet.payload.length} bytes)`);
    }
  }
});

aedes.on('subscribe', function (subscriptions, client) {
  if (client) {
    subscriptions.forEach(s => {
      console.log(`[MQTT] [SUB] Client "${client.id}" subscribed to: "${s.topic}"`);
    });
  }
});

// Graceful termination
process.on('SIGINT', () => {
  console.log('\n[MQTT BROKER] Shutting down broker...');
  aedes.close(() => {
    server.close(() => {
      console.log('[MQTT BROKER] Closed.');
      process.exit(0);
    });
  });
});

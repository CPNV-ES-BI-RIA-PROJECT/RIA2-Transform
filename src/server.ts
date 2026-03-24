// src/server.ts
import app from './app.js';
import { startMqttBridge } from './mqtt.js';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.listen(PORT, () => {
  console.log(`Fake ICS microservice running on http://localhost:${PORT}`);
  startMqttBridge();
});
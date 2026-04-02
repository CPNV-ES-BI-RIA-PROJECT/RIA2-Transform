// src/application/OrchestratorWithMqtt.ts
import { OrchestratorService } from './OrchestratorService.js';
import { startMqttBridge } from './mqttBridge.js';
import {IcsService} from "./IcsService.js";
import {BucketAdapterClient} from "../infrastructure/clients/BucketAdapterClient.js"; // your MQTT file

export class OrchestratorWithMqtt extends OrchestratorService {
    private mqttClient = null;

    constructor(icsService: IcsService, bucketClient: BucketAdapterClient) {
        super();

        // Initialize MQTT bridge only if broker URL exists
        this.mqttClient = startMqttBridge();

        if (this.mqttClient) {
            console.log('[Orchestrator] MQTT transport enabled');
        }
    }

    // Optional: shutdown MQTT gracefully
    public async shutdown() {
        if (this.mqttClient) {
            this.mqttClient.end();
            console.log('[Orchestrator] MQTT transport stopped');
        }
    }
}
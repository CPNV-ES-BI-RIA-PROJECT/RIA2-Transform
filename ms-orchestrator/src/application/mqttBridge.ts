// src/application/mqttBridge.ts
import { OrchestratorService } from './OrchestratorService.js';
import mqtt, { type IClientOptions, type MqttClient } from 'mqtt';

const orchestrator = new OrchestratorService(); // or pass the real instance

client.on('message', async (receivedTopic, payloadBuffer) => {
    // parse command...
    const command = parseStartCommand(payloadBuffer);
    const jobId = normalizeJobId(command.job_id) ?? 'unknown-job';
    const uri = command.input?.uri;

    try {
        publishJson(client, runningTopic, { schemaVersion, job_id: jobId, progress: 0 }, publishQos);

        // Use orchestrator instead of calling ICS and Bucket directly
        const result = await orchestrator.convertAndPublish(uri);

        publishJson(client, completedTopic, {
            schemaVersion,
            job_id: jobId,
            output: { uri: result.url },
        }, publishQos);
    } catch (error) {
        publishJson(client, failedTopic, {
            schemaVersion,
            job_id: jobId,
            error: { code: error.code ?? 'INTERNAL_ERROR', message: error.message },
        }, publishQos);
    }
});
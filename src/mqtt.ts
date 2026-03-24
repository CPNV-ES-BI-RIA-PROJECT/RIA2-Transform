import mqtt, { type IClientOptions, type MqttClient } from 'mqtt';
import {
  fetchIcsFromUrl,
  TransformError,
  transformIcsContent,
} from './transform.js';

type StartCommand = {
  schemaVersion?: string;
  job_id?: string;
  input?: {
    uri?: string;
  };
  options?: Record<string, unknown>;
};

type RunningEvent = {
  schemaVersion: string;
  job_id: string;
  progress?: number;
  stats?: {
    durationMs?: number;
    items_processed?: number;
  };
};

type CompletedEvent = {
  schemaVersion: string;
  job_id: string;
  output: {
    uri: string;
  };
};

type FailedEvent = {
  schemaVersion: string;
  job_id: string;
  error: {
    code: string;
    message: string;
  };
};

function envInt(name: string, fallback: number): number {
  const value = process.env[name];
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function envQos(name: string, fallback: 0 | 1 | 2): 0 | 1 | 2 {
  const value = envInt(name, fallback);
  if (value === 0 || value === 1 || value === 2) {
    return value;
  }

  return fallback;
}

function topic(
  namespace: string,
  serviceName: string,
  commandType: 'cmd' | 'event',
  action: string
): string {
  return `etl/${namespace}/${serviceName}/${commandType}/${action}`;
}

function publishJson(
  client: MqttClient,
  publishTopic: string,
  message: RunningEvent | CompletedEvent | FailedEvent,
  qos: 0 | 1 | 2
): void {
  client.publish(
    publishTopic,
    JSON.stringify(message),
    { qos, retain: false },
    (err?: Error) => {
      if (err) {
        console.error(`[MQTT] publish error on ${publishTopic}:`, err.message);
      }
    }
  );
}

function parseStartCommand(payload: Buffer): StartCommand {
  let parsed: unknown;
  try {
    parsed = JSON.parse(payload.toString('utf8'));
  } catch {
    throw new TransformError(400, 'INVALID_PAYLOAD', 'Payload must be valid JSON');
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new TransformError(400, 'INVALID_PAYLOAD', 'Payload must be a JSON object');
  }

  return parsed as StartCommand;
}

function normalizeJobId(candidate?: string): string | null {
  const value = candidate?.trim();
  return value && value.length > 0 ? value : null;
}

export function startMqttBridge(): MqttClient | null {
  const brokerUrl = process.env.MQTT_BROKER_URL;
  if (!brokerUrl) {
    console.log('[MQTT] MQTT_BROKER_URL not set. MQTT transport disabled.');
    return null;
  }

  const namespace = process.env.MQTT_NAMESPACE ?? 'stack1';
  const serviceName = process.env.MQTT_SERVICE_NAME ?? 'transform';
  const schemaVersion = process.env.MQTT_SCHEMA_VERSION ?? '1.0';
  const subscribeQos = envQos('MQTT_SUBSCRIBE_QOS', 0);
  const publishQos = envQos('MQTT_PUBLISH_QOS', 0);

  const startTopic = topic(namespace, serviceName, 'cmd', 'start');
  const runningTopic = topic(namespace, serviceName, 'event', 'running');
  const completedTopic = topic(namespace, serviceName, 'event', 'completed');
  const failedTopic = topic(namespace, serviceName, 'event', 'failed');

  const options: IClientOptions = {
    clean: true,
  };

  const clientId = process.env.MQTT_CLIENT_ID?.trim();
  if (clientId) {
    options.clientId = clientId;
  }

  const username = process.env.MQTT_USERNAME?.trim();
  if (username) {
    options.username = username;
    const password = process.env.MQTT_PASSWORD;
    if (password) {
      options.password = password;
    }
  }

  const client = mqtt.connect(brokerUrl, options);

  client.on('connect', () => {
    console.log(`[MQTT] connected to ${brokerUrl}`);
    client.subscribe(startTopic, { qos: subscribeQos }, (err) => {
      if (err) {
        console.error(`[MQTT] subscribe failed on ${startTopic}:`, err.message);
        return;
      }

      console.log(`[MQTT] subscribed to ${startTopic}`);
    });
  });

  client.on('error', (err) => {
    console.error('[MQTT] client error:', err.message);
  });

  client.on('reconnect', () => {
    console.warn('[MQTT] reconnecting...');
  });

  client.on('close', () => {
    console.warn('[MQTT] connection closed');
  });

  client.on('offline', () => {
    console.warn('[MQTT] client offline');
  });

  client.on('message', async (receivedTopic, payloadBuffer) => {
    if (receivedTopic !== startTopic) {
      return;
    }

    const startedAt = Date.now();
    let jobId = 'unknown-job';

    try {
      const command = parseStartCommand(payloadBuffer);
      jobId = normalizeJobId(command.job_id) ?? jobId;

      if (command.schemaVersion !== schemaVersion) {
        throw new TransformError(
          400,
          'INVALID_SCHEMA_VERSION',
          `Unsupported schemaVersion: expected ${schemaVersion}`
        );
      }

      if (!normalizeJobId(command.job_id)) {
        throw new TransformError(400, 'MISSING_JOB_ID', 'Missing required job_id');
      }

      const uri = command.input?.uri;
      if (!uri) {
        throw new TransformError(400, 'MISSING_INPUT_URI', 'Missing required input.uri');
      }

      publishJson(
        client,
        runningTopic,
        {
          schemaVersion,
          job_id: jobId,
          progress: 0,
        },
        publishQos
      );

      const icsContent = await fetchIcsFromUrl(uri);
      const result = await transformIcsContent(icsContent);

      publishJson(
        client,
        completedTopic,
        {
          schemaVersion,
          job_id: jobId,
          output: {
            uri: result.url,
          },
        },
        publishQos
      );

      const durationMs = Date.now() - startedAt;
      console.log(
        `[MQTT] job ${jobId} completed in ${durationMs}ms (${result.eventCount} events)`
      );
    } catch (error) {
      const transformError =
        error instanceof TransformError
          ? error
          : new TransformError(500, 'INTERNAL_ERROR', 'Internal server error');

      publishJson(
        client,
        failedTopic,
        {
          schemaVersion,
          job_id: jobId,
          error: {
            code: transformError.code,
            message: transformError.message,
          },
        },
        publishQos
      );
    }
  });

  return client;
}

// src/application/OrchestratorService.ts
import { IcsService } from "./IcsService.js";
import { BucketAdapterClient } from "../infrastructure/clients/BucketAdapterClient.js";

export class OrchestratorService {
    constructor(
        private icsService: IcsService,
        private bucketClient: BucketAdapterClient
    ) {}

    async convertAndPublish(icsUrl: string): Promise<{ url: string }> {
        // Convert ICS to JSON
        const events = await this.icsService.convertFromUrl(icsUrl);

        // Generate file name
        const fileName = `ics-${Date.now()}.json`;
        const content = Buffer.from(JSON.stringify(events, null, 2));

        // Upload and publish
        await this.bucketClient.upload(fileName, content);
        const url = await this.bucketClient.publish(fileName);

        return { url };
    }
}
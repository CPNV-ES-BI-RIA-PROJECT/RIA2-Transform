// src/application/IcsService.ts

import axios from "axios";
import { parseIcs } from "../domain/icsParser.js";
import { BucketAdapterClient } from "../infrastructure/clients/BucketAdapterClient.js";

export class IcsService {
    private bucketClient = new BucketAdapterClient();

    public async convertFromUrl(url: string): Promise<{ url: string }> {
        if (!url || url.trim().length === 0) {
            throw new Error("Missing url");
        }

        // 1. Fetch ICS
        const res = await axios.get<string>(url);
        const icsString = res.data;

        // 2. Convert to JSON
        const events = parseIcs(icsString);

        // 3. Serialize JSON
        const jsonBuffer = Buffer.from(JSON.stringify(events, null, 2));

        // 4. Generate file name
        const fileName = `ics-${Date.now()}.json`;

        // 5. Upload
        await this.bucketClient.upload(fileName, jsonBuffer);

        // 6. Publish
        const presignedUrl = await this.bucketClient.publish(fileName);

        return { url: presignedUrl };
    }
}
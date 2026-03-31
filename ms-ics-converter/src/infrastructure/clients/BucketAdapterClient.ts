// src/infrastructure/clients/BucketAdapterClient.ts

import axios from "axios";
import FormData from "form-data";

export class BucketAdapterClient {
    private baseUrl = process.env.BUCKET_ADAPTER_URL || "http://localhost:3000/api/v1/objects";

    async upload(fileName: string, content: Buffer): Promise<string> {
        const form = new FormData();

        form.append("file", content, {
            filename: fileName,
            contentType: "application/json",
        });

        const res = await axios.post(this.baseUrl, form, {
            headers: form.getHeaders(),
        });

        return res.data.key;
    }

    async publish(fileName: string): Promise<string> {
        const res = await axios.post(`${this.baseUrl}/${fileName}/publish`);
        return res.data.url;
    }
}
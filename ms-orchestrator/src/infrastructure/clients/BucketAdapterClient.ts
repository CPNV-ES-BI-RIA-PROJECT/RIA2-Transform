// src/infrastructure/clients/BucketAdapterClient.ts
export class BucketAdapterClient {
    private readonly baseUrl: string;

    constructor() {
        const url = process.env.BUCKET_ADAPTER_URL;
        if (!url) {
            throw new Error("BUCKET_ADAPTER_URL environment variable is not set");
        }
        this.baseUrl = url;
    }

    /**
     * Uploads a JSON file to the bucket adapter microservice.
     * @param fileName The name of the file to upload
     * @param content The file content as a Buffer
     * @returns The file name
     */
    async upload(fileName: string, content: Buffer): Promise<string> {
        const response = await fetch(this.baseUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                fileName,
                content: content.toString("utf-8") // convert Buffer to string
            }),
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Upload failed: ${response.status} ${text}`);
        }

        const result = await response.json();
        // Assuming the bucket adapter returns { fileName: string }
        return result.fileName ?? fileName;
    }

    /**
     * Publishes a previously uploaded file, returning a presigned URL.
     * @param fileName The file name
     * @returns Presigned URL
     */
    async publish(fileName: string): Promise<string> {
        const url = `${this.baseUrl}/${encodeURIComponent(fileName)}/publish`;
        const response = await fetch(url, { method: "POST" });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Publish failed: ${response.status} ${text}`);
        }

        const result = await response.json();
        return result.url;
    }
}
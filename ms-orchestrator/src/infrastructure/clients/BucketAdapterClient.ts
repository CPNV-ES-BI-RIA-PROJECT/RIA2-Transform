// src/infrastructure/clients/BucketAdapterClient.ts
export class BucketAdapterClient {
    async upload(fileName: string, content: Buffer): Promise<string> {
        // In production, upload to S3
        return fileName;
    }

    async publish(fileName: string): Promise<string> {
        // In production, generate presigned URL
        return `https://bucket-signed-url/${fileName}`;
    }
}
import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    HeadBucketCommand,
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export class S3Adapter {
    constructor(private s3Client: S3Client) {}

    // ----------------------
    // Config from .env
    // ----------------------
    private getBucket(): string {
        const bucket = process.env.S3_BUCKET;
        if (!bucket) {
            throw new Error("S3_BUCKET is not defined in environment variables");
        }
        return bucket;
    }

    private getExpiresIn(): number {
        return Number(process.env.S3_PRESIGNED_EXPIRES_IN || 3600);
    }

    // ----------------------
    // Bucket health check
    // ----------------------
    async checkBucketAccess(): Promise<void> {
        const bucket = this.getBucket();
        try {
            await this.s3Client.send(new HeadBucketCommand({ Bucket: bucket }));
        } catch (err) {
            console.error("S3 error:", err);
            throw err;
        }
    }

    // ----------------------
    // Upload content to S3
    // ----------------------
    async uploadFile(fileName: string, content: string | Buffer): Promise<void> {
        const bucket = this.getBucket();

        await this.s3Client.send(
            new PutObjectCommand({
                Bucket: bucket,
                Key: fileName,
                Body: content,
            })
        );
    }

    // ----------------------
    // Generate presigned URL
    // ----------------------
    async generatePresignedUrl(fileName: string): Promise<string> {
        const bucket = this.getBucket();

        const command = new GetObjectCommand({
            Bucket: bucket,
            Key: fileName,
        });

        return getSignedUrl(this.s3Client, command, {
            expiresIn: this.getExpiresIn(),
        });
    }
}
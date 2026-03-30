import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import fs from "fs";

export class S3Adapter {
    private readonly expiresIn: number;

    constructor(private s3Client: S3Client) {
        this.expiresIn = Number(process.env.S3_PRESIGNED_EXPIRES || 3600);
    }

    // ---------------------------
    // Upload file
    // ---------------------------
    async uploadFile(localPath: string, remotePath: string): Promise<void> {
        // extract bucket + key
        const match = remotePath.match(/^s3:\/\/([^\/]+)\/(.+)$/);
        if (!match) throw new Error("Invalid remotePath format");

        const [, bucket, key] = match;

        const stream = fs.createReadStream(localPath);

        try {
            await this.s3Client.send(
                new PutObjectCommand({
                    Bucket: bucket,
                    Key: key,
                    Body: stream,
                    ContentType: "application/json",
                })
            );
        } finally {
            try { fs.unlinkSync(localPath); } catch {}
        }
    }

    // ---------------------------
    // Presigned URL
    // ---------------------------
    async generatePresignedUrl(remotePath: string): Promise<string> {
        const match = remotePath.match(/^s3:\/\/([^\/]+)\/(.+)$/);
        if (!match) throw new Error("Invalid remotePath format");

        const [, bucket, key] = match;

        const command = new GetObjectCommand({ Bucket: bucket, Key: key });
        return getSignedUrl(this.s3Client, command, { expiresIn: this.expiresIn });
    }
}
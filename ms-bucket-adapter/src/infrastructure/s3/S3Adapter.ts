import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import fs from "fs";
import path from "path";
import crypto from "crypto";

export class S3Adapter {
    private readonly bucket: string;
    private readonly prefix: string;
    private readonly expiresIn: number;

    constructor(private readonly s3: S3Client) {
        this.bucket = process.env.S3_BUCKET_NAME!;
        this.prefix = process.env.S3_KEY_PREFIX || "objects";
        this.expiresIn = Number(process.env.S3_PRESIGNED_EXPIRES || 3600);
    }

    // ---------------------------
    // Upload file
    // ---------------------------
    async uploadFile(localPath: string): Promise<{ key: string }> {
        const fileName = path.basename(localPath);

        // Generate unique key
        const id = crypto.randomUUID();
        const key = `${this.prefix}/${id}-${fileName}`;

        const stream = fs.createReadStream(localPath);

        try {
            await this.s3.send(
                new PutObjectCommand({
                    Bucket: this.bucket,
                    Key: key,
                    Body: stream,
                    ContentType: "application/json",
                })
            );

            return { key };
        } finally {
            // Always cleanup local file
            try {
                fs.unlinkSync(localPath);
            } catch {
                // ignore cleanup errors
            }
        }
    }

    // ---------------------------
    // Presigned URL
    // ---------------------------
    async generatePresignedUrl(key: string): Promise<string> {
        const command = new GetObjectCommand({
            Bucket: this.bucket,
            Key: key,
        });

        return getSignedUrl(this.s3, command, {
            expiresIn: this.expiresIn,
        });
    }
}
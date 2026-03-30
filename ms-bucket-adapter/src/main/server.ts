// src/main/server.ts

import "dotenv/config";
import app from "./app.js";
import { S3Client } from "@aws-sdk/client-s3";
import { S3Adapter } from "../infrastructure/s3/S3Adapter.js";

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        console.log("Starting S3 microservice...");

        const s3Client = new S3Client({});
        const adapter = new S3Adapter(s3Client);

        const bucket = process.env.S3_BUCKET;

        if (!bucket) {
            throw new Error("S3_BUCKET env variable is not defined");
        }

        // ✅ Health check
        await adapter.checkBucketAccess(bucket);

        console.log(`✅ S3 bucket "${bucket}" is accessible`);

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
}

startServer();
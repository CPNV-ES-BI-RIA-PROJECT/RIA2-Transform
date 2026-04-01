// src/main/server.ts

import "dotenv/config";
import app from "./app.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger/swagger.json" with { type: "json" };

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

        // ----------------------
        // Swagger
        // ----------------------
        app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

        // Health check
        try{
            await adapter.checkBucketAccess();
        }catch (error){
            console.error(error);
        }

        console.log(`✅ S3 bucket "${bucket}" is accessible`);

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📚 Swagger: http://localhost:${PORT}/docs`);
        });

    } catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
}

startServer();
// src/main/server.ts
import "dotenv/config";
import app from "./app.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger/swagger.json" with { type: "json" };

// Existing services
import { IcsService } from "../application/IcsService.js";
import { BucketAdapterClient } from "../infrastructure/clients/BucketAdapterClient.js";

// MQTT-enabled orchestrator
import { OrchestratorWithMqtt } from "../application/OrchestratorWithMqtt.js";

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        console.log("Starting Orchestrator microservice...");

        // ----------------------
        // Services
        // ----------------------
        const icsService = new IcsService();
        const bucketClient = new BucketAdapterClient();
        // Use MQTT-enabled orchestrator
        const orchestrator = new OrchestratorWithMqtt(icsService, bucketClient);

        // make services available globally if needed (for controllers)
        app.locals.services = { orchestrator, icsService, bucketClient };

        // ----------------------
        // Swagger
        // ----------------------
        app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

        // ----------------------
        // Healthcheck
        // ----------------------
        app.get("/health", (_req, res) => {
            res.status(200).json({ status: "ok" });
        });

        // ----------------------
        // Global error handler
        // ----------------------
        app.use((err: any, _req: any, res: any, _next: any) => {
            console.error(err);
            res.status(err.status || 500).json({
                message: err.message || "Internal Server Error",
            });
        });

        // ----------------------
        // Start server
        // ----------------------
        const server = app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Swagger docs available at http://localhost:${PORT}/docs`);
        });

        // ----------------------
        // Graceful shutdown
        // ----------------------
        const shutdown = async () => {
            console.log("Shutting down Orchestrator...");
            await orchestrator.shutdown(); // stops MQTT client if running
            server.close(() => {
                console.log("HTTP server closed.");
                process.exit(0);
            });
        };

        process.on("SIGINT", shutdown);
        process.on("SIGTERM", shutdown);

    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

startServer();
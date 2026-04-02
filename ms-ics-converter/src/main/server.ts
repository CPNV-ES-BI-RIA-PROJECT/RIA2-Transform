// src/main/server.ts
import "dotenv/config";
import app from "./app.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger/swagger.json" with { type: "json" };

import { IcsService } from "../application/IcsService.js";

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        console.log("Starting ICS microservice...");

        // ----------------------
        // Services
        // ----------------------
        const icsService = new IcsService();

        // make service available (optional, for advanced use)
        app.locals.services = {
            icsService,
        };

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
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Swagger: http://localhost:${PORT}/docs`);
        });

    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

startServer();
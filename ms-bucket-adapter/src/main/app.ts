// src/app.ts
import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import { RegisterRoutes } from "../routes/routes.js";
import multer from "multer";

const app = express();

// ----------------------
// Middleware
// ----------------------
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// ---------------------
// Manage store file in memory (buffer)
// --------------------

const upload = multer({
    storage: multer.memoryStorage(),
});


// ----------------------
// TSOA routes
// ----------------------
RegisterRoutes(app);

// ----------------------
// Global error handler
// ----------------------
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";
    console.error(err);
    res.status(status).json({ message });
});

export default app;
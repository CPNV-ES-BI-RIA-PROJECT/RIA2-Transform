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
// ---------------------

const UPLOAD_MAX_FILE_SIZE = Number(process.env.UPLOAD_MAX_FILE_SIZE || 5 * 1024 * 1024);

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: UPLOAD_MAX_FILE_SIZE },
});

app.use(upload.single("file"));


// ----------------------
// TSOA routes
// ----------------------
RegisterRoutes(app);

// ----------------------
// Global error handler
// ----------------------
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({ message: `File too large. Max: ${process.env.S3_MAX_UPLOAD_SIZE} bytes.` });
    }
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";
    console.error(err);
    res.status(status).json({ message });
});

export default app;
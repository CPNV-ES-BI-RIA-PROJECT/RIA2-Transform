// src/app.ts
import express from 'express';
import type { Request, Response } from 'express';
import multer from 'multer';
import {
  fetchIcsFromUrl,
  TransformError,
  transformIcsContent,
} from './transform.js';

const app = express();
const upload = multer();

app.use(express.json()); // 👈 enable JSON body parsing

app.post('/api/v1/jobs', upload.single('file'), async (req: Request, res: Response) => {
  try {
    let fileContent: string;

            // ✅ Case 1: file upload (existing behavior)
            if (req.file) {
                if (!req.file.originalname.endsWith('.ics')) {
                    return res.status(415).json({
                        error: 'Unsupported media type. Only .ics files are allowed',
                    });
                }

                fileContent = req.file.buffer.toString();
            }

            // ✅ Case 2: URL in JSON body (new behavior)
            else if (req.body?.url) {
              fileContent = await fetchIcsFromUrl(req.body.url);
            }

            // ❌ Neither provided
            else {
                return res.status(400).json({
                    error: 'Provide either a file or a url',
                });
            }

            // ✅ Parse ICS
            const result = await transformIcsContent(fileContent);
            return res.status(201).json({ url: result.url });
        } catch (error) {
            if (error instanceof TransformError) {
                return res.status(error.status).json({ error: error.message });
            }
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
);

export default app;
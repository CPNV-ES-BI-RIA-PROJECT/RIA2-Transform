// src/app.ts
import express from 'express';
import type { Request, Response } from 'express';
import multer from 'multer';
import ical from 'node-ical';
import fetch from 'node-fetch';

const app = express();
const upload = multer();

app.use(express.json()); // 👈 enable JSON body parsing

app.post(
    '/api/v1/jobs',
    upload.single('file'),
    async (req: Request, res: Response) => {
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
                try {
                    const response = await fetch(req.body.url);

                    if (!response.ok) {
                        return res.status(400).json({ error: 'Failed to fetch file from URL' });
                    }

                    fileContent = await response.text();
                } catch (err) {
                    return res.status(400).json({ error: 'Invalid URL or fetch failed' });
                }
            }

            // ❌ Neither provided
            else {
                return res.status(400).json({
                    error: 'Provide either a file or a url',
                });
            }

            // ✅ Parse ICS
            let data;
            try {
                data = await ical.async.parseICS(fileContent);
            } catch {
                return res.status(422).json({ error: 'Invalid ICS format' });
            }

            const events = Object.values(data).filter(e => e.type === 'VEVENT');

            if (events.length === 0) {
                return res.status(422).json({ error: 'No events found in ICS' });
            }

            if (events.length === 1) {
                return res.status(201).json({
                    url: 'https://bi1-nicolas.s3.eu-west-1.amazonaws.com/single-event.json',
                });
            }

            return res.status(201).json({
                url: 'https://bi1-nicolas.s3.eu-west-1.amazonaws.com/multiple-events.json',
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
);

export default app;
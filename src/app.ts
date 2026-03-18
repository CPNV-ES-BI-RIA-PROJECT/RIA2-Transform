// src/app.ts
import express, { Request, Response } from 'express';
import multer from 'multer';
import ical from 'node-ical';

const app = express();
const upload = multer();

// POST /api/v1/jobs
app.post('/api/v1/jobs', upload.single('file'), async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        if (!req.file.originalname.endsWith('.ics')) {
            return res.status(415).json({ error: 'Unsupported media type. Only .ics files are allowed' });
        }

        const fileContent = req.file.buffer.toString();

        let data;
        try {
            data = await ical.async.parseICS(fileContent);
        } catch (err) {
            return res.status(422).json({ error: 'Invalid ICS format' });
        }

        const events = Object.values(data).filter(e => e.type === 'VEVENT');

        if (events.length === 0) {
            return res.status(422).json({ error: 'No events found in ICS' });
        }

        if (events.length === 1) {
            return res.status(201).json({ url: 'https://bi1-nicolas.s3.eu-west-1.amazonaws.com/single-event.json' });
        }

        return res.status(201).json({ url: 'https://bi1-nicolas.s3.eu-west-1.amazonaws.com/multiple-events.json' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

export default app;
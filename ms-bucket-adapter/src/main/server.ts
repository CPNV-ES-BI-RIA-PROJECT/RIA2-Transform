// src/main/server.ts
import express, { Request, Response, NextFunction } from 'express';
import swaggerUi from 'swagger-ui-express';
import { RegisterRoutes } from '../routes/routes';
import * as swaggerDocument from '../../dist/swagger.json';

import { IcsService } from '../application/IcsService';

const icsService = new IcsService();

const app = express();

// === Service == //
app.locals.services = {
    icsService
};

// === Middleware ===
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// === Swagger UI ===
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// === TSOA-generated routes ===
RegisterRoutes(app);

// === Healthcheck ===
app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
});

// === Error handler ===
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// === Start server ===
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`Swagger UI available at http://localhost:${port}/docs`);
});
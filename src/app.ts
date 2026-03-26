import express from 'express';
import { RegisterRoutes } from './routes/routes'; // 👈 add this
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());

// Register all tsoa controllers/routes
RegisterRoutes(app);

export default app;
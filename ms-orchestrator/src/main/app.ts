import express from 'express';
import { RegisterRoutes } from '../routes/routes.js'; // 👈 add this

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register all tsoa controllers/routes
RegisterRoutes(app);

export default app;
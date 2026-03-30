import app from './app.js';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.listen(PORT, () => {
    console.log(`MS-Bucket-Adapter microservice running on http://localhost:${PORT}`);
});
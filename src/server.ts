// src/server.ts
import app from './app';

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Fake ICS microservice running on http://localhost:${PORT}`);
});
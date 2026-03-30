import app from "./app.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`S3 microservice running on port ${PORT}`);
});
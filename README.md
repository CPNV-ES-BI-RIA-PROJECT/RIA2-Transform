# Drive API

A REST API allowing interaction with different cloud drive providers.

Currently, this is only a fake api returning always the same url (test purpose).

## Build and run locally

# Build Docker image

```bash
docker build -t transform .
```

# Run container

```bash
docker run -p 3000:3000 transform
```

# Test the route

```bash
curl -X POST -F "file=@example.csv" http://localhost:3000/api/v1/jobs
```

```
{
"url": "https://always.the.same.url"
}
```

Publish to Docker hub

```
docker login
```


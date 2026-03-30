# Bucket Adapter Microservice

## Description

The Bucket Adapter microservice provides a simple interface to store JSON results from ETL or transformation processes into AWS S3 and to generate presigned URLs for secure access. It acts as a thin wrapper over S3, abstracting bucket/key management and exposing easy-to-use HTTP endpoints.

## Getting Started

### Prerequisites

//TODO

### Configuration

* Set the environnement variables

```bash
cp sample.env .env
```

* Update the value

## Usage

# Install dependencies
```bash
pnpm install
```
# Run in dev mode (hot reload)
```bash
pnpm dev
```

# Build
```bash
pnpm build
```

# Start server
```bash
pnpm start
```

# Run tests
```bash
pnpm test
```

# Call the API

* Upload a new objet on the bucket

```bash
  curl -X POST http://localhost:3000/api/v1/objects \
    -H "Content-Type: application/json" \
    -d '{
          "localPath": "/tmp/results.json",
          "remotePath": "s3://my-bucket/etl/results/results.json"
        }'
```

* Publish the object using a presigned url

```bash
  curl -X POST http://localhost:3000/api/v1/objects/publish \
  -H "Content-Type: application/json" \
  -d '{
  "remotePath": "s3://my-bucket/etl/results/results.json"
  }'
```

## Deployment

### On dev environment

* Using tsoa to update the router

```bash
npx tsoa routes
npx tsoa spec
```

### On stage environment

How to deploy the application outside the dev environment.

## Directory structure

* Tip: try the tree bash command

```shell
src/
├── application/        # ICS conversion business logic (multi-event)
├── domain/             # ICS event types, parser logic
├── infrastructure/     # stubs for Google Drive, cache, broker
├── main/               # server setup, Swagger, routers
├── presentation/       # controllers (Swagger exposed)
├── config/             # environment
├── shared/             # utilities/helpers
tests/                  # Jest unit tests
```

## Collaborate

* Take time to read some readme and find the way you would like to help other developers collaborate with you.

* They need to know:
    * [How to propose a new feature]()
    * [How to commit](https://www.conventionalcommits.org/en/v1.0.0/)
    * [How to use your workflow](https://nvie.com/posts/a-successful-git-branching-model/)

## License

[LICENSE](LICENSE.md)

## Contact

* [LinkedIn](https://www.linkedin.com/in/nicolas-glassey-agile/)
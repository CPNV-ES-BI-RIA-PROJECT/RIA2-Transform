# Bucket Adapter Microservice

## Description

The Bucket Adapter microservice provides a simple interface to store JSON results from ETL or transformation processes into AWS S3 and to generate presigned URLs for secure access. It acts as a thin wrapper over S3, abstracting bucket/key management and exposing easy-to-use HTTP endpoints.

## Getting Started

### Prerequisites

//TODO

Node
NPM

### Configuration

* Set the environnement variables

```bash
cp sample.env .env
```

# Call the API

* Upload a new objet on the bucket

```bash
curl -X POST http://localhost:3000/api/v1/objects \
  -H "Content-Type: application/json" \
  -d '{
    "fileName": "test.json",
    "fileContent": "{\"hello\":\"world\"}"
  }'
```

* Publish the object using a presigned url

```bash
curl -X POST http://localhost:3000/api/v1/objects/test.json/publish
```

```bash
{
  "url": "https://your-presigned-url"
}
```

## Deployment

* Update the router

```bash
pnpm generate
```

### On dev environment

```bash
pnpm run dev
```

### On stage environment

```bash
pnpm build
```

```bash
nodemon dist/main/server.js
```

### On stage prod

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
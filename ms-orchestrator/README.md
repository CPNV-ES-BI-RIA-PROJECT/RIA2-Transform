# ICS Transform Microservice

## Description

Orchestrator Microservice is a TypeScript-based service that coordinates workflows between microservices. Its primary
function is to convert ICS calendar files into JSON events and then publish the results to a storage service. The
service follows clean architecture principles, is fully modular, and is designed to be easily extended or integrated
with other components such as Google Drive, caches, message brokers, or additional microservices for enhanced
automation.

## Getting Started

### Prerequisites

//TODO

### Configuration

* Copy and rename the sample.env

```bash
cp .env.example .env
```

* Update the variables values as needed

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

```bash
curl -X POST http://localhost:3000/api/v1/transforms \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://bi1-nicolas.s3.eu-west-1.amazonaws.com/multi-events.ics"
  }'
```

## Deployment

### On dev environment

How to get dependencies and build?
How to run the tests?

### On stage environment

```bash

```

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
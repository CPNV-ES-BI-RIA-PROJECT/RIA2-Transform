# ICS Transform Microservice

## Description

ICS Transform Microservice is a TypeScript-based service that converts ICS calendar files into JSON events. It is designed as a modular, scalable microservice, following clean architecture principles, and ready to integrate with other components like Google Drive, cache, or message brokers.

## Getting Started

### Prerequisites

List all dependencies and their version needed by the project as :

* DataBase Engine (MySql, PostgreSQL, MSSQL,...)
* IDE used (PhpStorm, Visual Studio Code, IntelliJ,...)
* Package manager (Nuget, Composer, npm, ...)
* OS supported (W2k22, Debian12,...)
* Virtualization (Docker, .Net, .JDK, .JRE)

### Configuration

How to set up the database?
How do you set the sensitive data?

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
curl -X POST http://localhost:3002/api/v1/conversions \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://bi1-nicolas.s3.eu-west-1.amazonaws.com/multiple-events.ics"
  }'
```

## Deployment

### On dev environment

How to get dependencies and build?
How to run the tests?

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
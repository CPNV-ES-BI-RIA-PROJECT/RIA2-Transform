# RIA2-Transform (Fake)

This is a fake Node.js + TypeScript microservice that simulates converting ICS calendar files to JSON and returning a public link.

It does not actually push files to Google Drive. It’s intended as a base for a real service.

# Fake features

* Accepts .ics files via POST /api/v1/jobs

```curl
curl -F "file=@./tests/data/single-event.ics" http://localhost:3000/api/v1/jobs
```

##Handles:

| Scenario                  | HTTP Status | Response / Description                     |
| ------------------------- |-------------| ------------------------------------------ |
| Single ICS event          | 201         | Link to JSON representing the single event |
| Multiple ICS events       | 201         | Link to JSON representing multiple events  |
| Empty ICS file            | 422         | No events found in ICS                     |
| Invalid ICS file          | 422         | Invalid ICS format                         |
| Wrong file type (non-ICS) | 415         | Unsupported media type                     |
| No file in request        | 400         | No file uploaded                           |
| Unhandled error           | 500         | Internal server error                      |

Fully written in TypeScript, using node-ical for parsing

## Build and run locally

### Classic deployment

| Command          | Description                                 |
| ---------------- | ------------------------------------------- |
| `pnpm run dev`   | Run server in development mode (ts-node)    |
| `pnpm run build` | Compile TypeScript to `dist/` folder        |
| `pnpm start`     | Run production server from compiled `dist/` |

# Build Docker image

| Step                               | Command                                        | Description                                                             |
| ---------------------------------- |------------------------------------------------| ----------------------------------------------------------------------- |
| **Build the Docker image**         | `docker build -t transform:latest .`           | Compiles the TypeScript code and builds a production-ready Docker image |
| **Run the container**              | `docker run -p 3000:3000 transform:latest`     | Starts the microservice, mapping port 3000 from container → host        |
| **Optional: Run in detached mode** | `docker run -d -p 3000:3000 --name transform transform:latest` | Runs the container in background (detached) with a name                 |
| **Stop the container**             | `docker stop transform`                        | Stops the running container by name                                     |
| **Remove the container**           | `docker rm transform`                          | Deletes the stopped container                                           |


Publish to Docker hub

[See the organization wiki's page](https://github.com/CPNV-ES-BI-RIA-PROJECT/.github/wiki/Publish-images-on-Containers-Registry-Organization).

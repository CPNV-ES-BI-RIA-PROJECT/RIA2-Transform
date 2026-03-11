# Drive API

A REST API allowing interaction with different cloud drive providers.

Currently supported provider:

- Google Drive

Future providers:

- OneDrive
- Dropbox

The API exposes a unified interface to perform common operations on cloud drives.

## Features

- Create folders
- Upload files (CSV supported)
- Generate public share links

The provider implementation is abstracted to allow switching providers without changing the API.

---

# Architecture

The project follows a layered architecture inspired by enterprise backend frameworks.

```
Layer responsibilities:

| Layer | Responsibility |
|------|---------------|
| routes | HTTP routing and request validation |
| controllers | API endpoints |
| services | Business logic |
| providers | Drive provider implementations |
| infrastructure | SDK integration |
| container | Dependency injection |

Dependency injection is handled using **Awilix**.
```

---

# API Endpoints

## Create folder

* [POST] /folders

```
    //Body
    {
        "name" : "Invoices"
    }
```

## Upload file

* [POST] /folders/{folderId}/files

```
    Content-Type : multipart/from-data
```

## Share file

* [POST] /files/{fileId}/share

```
    Response
    {
    "url": "https://drive.google.com/file/d/FILE_ID/view
    "
    }
```

# Configuration

Environment variables are defined in `.env`.

Example:

```
    PORT=3000
    DRIVE_PROVIDER=google
    GOOGLE_APPLICATION_CREDENTIALS=./credentials.json
    LINK_TTL=3600
```

# Installation

* Clone repository
* Install dependencies

```
    pnpm install
```

* Start development server

```
    pnpm dev
```

# Testing

* Run tests:

```
pnpm test
```

# Licence

Educational project [LICENCE](./LICENCE)

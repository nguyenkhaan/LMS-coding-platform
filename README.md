# LMS Online Coding Platform

A modern Learning Management System (LMS) and online coding platform designed with a microservices architecture. This repository is structured as a monorepo containing backend services (FastAPI), a frontend application (Svelte 5 & SvelteKit), and supporting local infrastructure (Docker Compose).

## Technology Stack

[![Python 3.14+](https://img.shields.io/badge/Python-3.14+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Svelte 5](https://img.shields.io/badge/Svelte-5-FF3E00?style=for-the-badge&logo=svelte&logoColor=white)](https://svelte.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Bun Runtime](https://img.shields.io/badge/Bun-Runtime-000000?style=for-the-badge&logo=bun&logoColor=white)](https://bun.sh/)
[![UV Package Manager](https://img.shields.io/badge/UV-Manager-DE5C2E?style=for-the-badge&logo=python&logoColor=white)](https://github.com/astral-sh/uv)
[![Docker Compose](https://img.shields.io/badge/Docker_Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

---

## Folder Structure

The repository organizes its backend services, frontend application, and environment configuration in a structured monorepo:

```text
LMS-coding-platform/
├── src/
│   ├── backend/
│   │   ├── auth-provider/         # Authentication & User Service (FastAPI + uv)
│   │   ├── business-application/  # Core LMS API (FastAPI + uv)
│   │   └── judge/                 # Code compilation sandbox (planned)
│   └── frontend/                  # Svelte 5 Web Application (SvelteKit + Bun)
├── docker-compose.yaml            # Local infrastructure stack definition
├── .env.example                   # Shared root environment template for Docker
└── README.md                      # General project instructions (this file)
```

---

## Architecture Overview

```mermaid
graph TD
    Client[Web Frontend: Svelte 5 / Bun]
    AuthSvc[Auth Provider Service: FastAPI / Port 4001]
    BizSvc[Business Application Service: FastAPI / Port 4000]
    
    DB[(PostgreSQL Database)]
    Cache[(Redis Cache & Session Store)]
    MQ[(RabbitMQ Message Broker)]
    S3[(MinIO Object Storage)]

    Client -->|Authenticates| AuthSvc
    Client -->|Course & Coding Tasks| BizSvc
    
    BizSvc -->|Loads Public Key| AuthSvc
    AuthSvc -->|Cache / Sessions| Cache
    AuthSvc -->|User Tables| DB
    BizSvc -->|LMS Tables| DB
    
    %% Future services connections
    %% BizSvc -->|Queues Code Run| MQ
    %% S3 -->|Stores Static Assets / Submissions| BizSvc
```

---

## Infrastructure Setup (Docker)

Before running the backend or frontend services locally, spin up the supporting storage and middleware engines using Docker.

### 1. Setup root environment variables
Copy the template `.env.example` in the root folder to `.env`:
```bash
cp .env.example .env
```
*(Optionally modify usernames or passwords inside `.env` to configure your local container stack).*

### 2. Start the infrastructure
Start the PostgreSQL, Adminer, Redis, RabbitMQ, and MinIO instances in the background:
```bash
docker compose up -d
```

### 3. Verify running containers
Ensure all containers are up and running:
```bash
docker compose ps
```

### 4. Local Service Ports & Endpoints
Once up, the following local services are available:

| Service | Port | Endpoint | Credentials / Details |
|---------|------|----------|----------------------|
| **PostgreSQL** | `5432` | `localhost:5432` | User: `lms`, Password: `change-me-postgres`, DB: `lms` |
| **Adminer** (DB UI) | `8080` | [http://localhost:8080](http://localhost:8080) | Server: `postgres`, Username: `lms` |
| **Redis** | `6379` | `localhost:6379` | Used for caching and user sessions |
| **RabbitMQ API** | `5672` | `localhost:5672` | Event broker connection string |
| **RabbitMQ Console** | `15672` | [http://localhost:15672](http://localhost:15672) | Username: `lms`, Password: `change-me-rabbitmq` |
| **MinIO API** | `9000` | `localhost:9000` | S3-compatible storage gateway |
| **MinIO Console** | `9001` | [http://localhost:9001](http://localhost:9001) | Username: `minioadmin`, Password: `minioadmin` |

### 5. Stop the infrastructure
To shut down and stop the infrastructure services:
```bash
docker compose down
```

---

## Services Setup & Development

Detailed, step-by-step setup guides for building, running, and testing each component are available in their respective service folders:

1. **Authentication Provider** (Backend): Read [auth-provider README](file:///home/cloud/workspace/python/LMS-coding-platform/src/backend/auth-provider/README.md)
2. **Business Application** (Backend): Read [business-application README](file:///home/cloud/workspace/python/LMS-coding-platform/src/backend/business-application/README.md)
3. **Web Frontend** (Svelte 5): Read [frontend README](file:///home/cloud/workspace/python/LMS-coding-platform/src/frontend/README.md)

> [!TIP]
> Always make sure that your root Docker stack is running before starting the development servers for the backend services.

# LMS Online Coding Platform

A modern Learning Management System (LMS) and online coding platform designed with a microservices architecture. This repository is structured as a monorepo containing backend services (FastAPI), a frontend application (React & Vite), and supporting local infrastructure (Docker Compose).

## Technology Stack

[![Python 3.14+](https://img.shields.io/badge/Python-3.14+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
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
│   └── frontend/                  # React Web Application (Vite + Bun)
├── docker-compose.yaml            # Local infrastructure stack definition
├── .env.example                   # Shared root environment template for Docker
└── README.md                      # General project instructions (this file)
```

---

## Architecture Overview

```mermaid
graph TD
    Client[Web Frontend: React / Bun]
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

## Infrastructure Setup

This project now uses cloud-managed services for database and cache. The backend services should be configured to use Supabase for PostgreSQL and Upstash for Redis.

If you want to keep a local container stack for legacy or development testing, the `docker compose` files remain available, but they are not required for the current cloud-based setup.

### 1. Setup root environment variables
Copy the template `.env.example` in the root folder to `.env`:
```bash
cp .env.example .env
```

### 2. Cloud service configuration
Update `.env` values in each service folder to use:
- Supabase PostgreSQL connection string for `DATABASE_URL`
- Upstash Redis connection values for `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`

### 3. Local Docker usage (optional)
If you still choose to use local Docker infrastructure for legacy or testing purposes, you may run:
```bash
docker compose up -d
```

### 4. Optional verification
If using local Docker, verify containers are running:
```bash
docker compose ps
```

### 5. Optional shutdown
To stop the local Docker infrastructure:
```bash
docker compose down
```

---

## Services Setup & Development

Detailed, step-by-step setup guides for building, running, and testing each component are available in their respective service folders:

1. **Authentication Provider** (Backend): Read [auth-provider README](file:///home/cloud/workspace/python/LMS-coding-platform/src/backend/auth-provider/README.md)
2. **Business Application** (Backend): Read [business-application README](file:///home/cloud/workspace/python/LMS-coding-platform/src/backend/business-application/README.md)
3. **Web Frontend** (React): Read [frontend README](file:///home/cloud/workspace/python/LMS-coding-platform/src/frontend/README.md)

> [!TIP]
> Always make sure that your root Docker stack is running before starting the development servers for the backend services.

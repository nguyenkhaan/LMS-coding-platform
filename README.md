# LMS Platform

![Python](https://img.shields.io/badge/Python-3.14%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Svelte](https://img.shields.io/badge/Svelte-5-FF3E00?style=for-the-badge&logo=svelte&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-runtime-000000?style=for-the-badge&logo=bun&logoColor=white)

## Overview

This repository is a monorepo for an LMS online coding platform. It includes backend services for authentication, business application logic, and future extensions such as the judge and AI interview modules, plus a Svelte-based frontend.

## Folder structure

```text
src/
  backend/
    auth-provider/
    business-application/
    judge/
    ai-interview/   # planned service
  frontend/
```

## Resource setup

Create a `.env` file in the repository root with the required values for local infrastructure:

```env
POSTGRES_DB=lms
POSTGRES_USER=lms
POSTGRES_PASSWORD=change-me
POSTGRES_PORT=5432

ADMINER_PORT=8080

RABBITMQ_DEFAULT_USER=lms
RABBITMQ_DEFAULT_PASS=change-me
RABBITMQ_PORT=5672
RABBITMQ_MANAGEMENT_PORT=15672

MINIO_ROOT_USER=lms
MINIO_ROOT_PASSWORD=change-me
MINIO_API_PORT=9000
MINIO_CONSOLE_PORT=9001
```

Start the supporting services with Docker Compose:

```bash
docker compose up -d
```

Local endpoints:

- PostgreSQL: http://localhost:5432
- Adminer: http://localhost:8080
- RabbitMQ: http://localhost:5672
- RabbitMQ UI: http://localhost:15672
- MinIO API: http://localhost:9000
- MinIO Console: http://localhost:9001

Stop the stack with:

```bash
docker compose down
```

## How to run the backend

### Auth provider

```bash
cd src/backend/auth-provider
python3 -m venv .venv
source .venv/bin/activate
pip install -e .
python main.py
```

### Business application

```bash
cd src/backend/business-application
python3 -m venv .venv
source .venv/bin/activate
pip install -e .
python main.py
```

The business application will start with Uvicorn and serve the API on http://localhost:8000.

## How to run the frontend

```bash
cd src/frontend
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.

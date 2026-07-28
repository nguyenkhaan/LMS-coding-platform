# Auth Provider Service

The **Auth Provider** is a FastAPI-based authentication service. It manages user registration, logins, session caching, and issues JSON Web Tokens (JWT) for authentication across other services in the LMS platform.

---

## Technologies Used

- **Python 3.14+**
- **FastAPI**: Modern, fast web framework for building APIs.
- **SQLAlchemy (Async)**: SQL toolkit and Object Relational Mapper (ORM) using asynchronous operations.
- **Asyncpg**: Fast PostgreSQL database client library for Python.
- **Redis (Async)**: Memory cache and session store.
- **Pwdlib & Argon2**: Secure password hashing algorithms.
- **PyJWT**: JSON Web Token implementation.
- **UV**: Standard package and environment manager.
- **Uvicorn**: ASGI web server implementation.

---

## Getting Started & Setup

Follow these steps to configure and run the Auth Provider service locally.

### Prerequisites

Ensure the following are installed:
- [UV Package Manager](https://docs.astral.sh/uv/getting-started/installation/): Package manager used by this project.

> NOTE: Database and Redis are now hosted on Supabase and Upstash, so local Docker containers are not required for these services.

---

### Step 1: Initialize the Environment

1. Navigate to the service directory:
   ```bash
   cd src/backend/auth-provider
   ```

2. Create a virtual environment and install all dependencies:
   ```bash
   uv sync
   ```
   *(This will create a local `.venv` folder and install packages locked in `uv.lock` automatically).*

3. Ensure that the virtual environment is activated. You can do this by running following commands (using for Bash only)
   ```bash
   source .venv/bin/activate
   ```
---

### Step 2: Setup Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Fill in the values inside `.env`. The database connection string should point to your Supabase Postgres instance and Redis should use Upstash.
   - **Important**: The service expects base64-encoded JWT keys (`JWT_ACCESS_PRIVATE` and `JWT_ACCESS_PUBLIC`) to successfully parse them from environment variables.

#### Generating the Base64 RSA Key Pair:

The system uses JWK and RSA authentication. Generate a key pair, including **Public Key** and **Private Key**.

You can use any trusted RSA key generator. After generating the key pair, encode each key as Base64.

Copy the two Base64 strings into the `.env` file.

```env
JWT_ACCESS_PRIVATE=<base64-encoded-private-key>
JWT_ACCESS_PUBLIC=<base64-encoded-public-key>
JWT_REFRESH_SECRET=<any-long-random-string>
BACKEND_URL=http://localhost:4001
DATABASE_URL=postgresql+asyncpg://<your_supabase_user>:<your_supabase_password>@<your_supabase_host>:5432/<your_supabase_db>
UPSTASH_REDIS_REST_URL=https://<your-upstash-id>.upstash.io
UPSTASH_REDIS_REST_TOKEN=<your-upstash-token>
```

---

### Step 3: Run the Service

Because the database and Redis are cloud-managed via Supabase and Upstash, you do not need to start local Docker containers for those services.

Run the FastAPI application:
```bash
# In src/backend/auth-provider
uv run main.py
```
*(The server will start Uvicorn, serving the API on [http://localhost:4001](http://localhost:4001) with hot-reload enabled).*

---

## API Endpoints

Once running, you can explore the interactive API docs:
- **Swagger UI**: [http://localhost:4001/docs](http://localhost:4001/docs)

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
- [UV Package Manager](https://docs.astral.sh/uv/getting-started/installation/): Packing Manager using for this project. 
- Docker (to run the backing database and Redis)


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

2. Fill in the values inside `.env`. The database connection string is already configured for the default Docker PostgreSQL container.
   - **Important**: The service expects base64-encoded JWT keys (`JWT_ACCESS_PRIVATE` and `JWT_ACCESS_PUBLIC`) to successfully parse them from environment variables.

#### Generating the Base64 RSA Key Pair:

The system is using JWK and RSA authentication. We need to generate a key pair, including **Public Key** and **Private Key**. 

You can visit this website for generating a key pairs: https://cryptotools.net/rsagen. Please **choose 2048 length** 

After generate a **Public Key** and **Private Key** pair. Visit this website to encode these keys into base64: https://www.base64encode.org/. Just copy your **Public Key** and **Private Key** and encode them to Base64 string sequently. 


Copy your 2 base 64 strings to the variables in the .env file. 

```env
JWT_ACCESS_PRIVATE=<Content of private_base64_string>
JWT_ACCESS_PUBLIC=<Content of public_base64_string>
JWT_REFRESH_SECRET=generate-any-long-random-string-here
BACKEND_URL=http://localhost:4001
DATABASE_URL=postgresql+asyncpg://lms:lms@localhost:5432/lms
```

---

### Step 3: Run the Service

Make sure your Docker infrastructure (root directory) is running:
```bash
# In the repository root
docker compose up -d
```

Now, run the FastAPI application:
```bash
# In src/backend/auth-provider
uv run main.py
```
*(The server will start Uvicorn, serving the API on [http://localhost:4001](http://localhost:4001) with hot-reload enabled).*

---

## API Endpoints

Once running, you can explore the interactive API docs:
- **Swagger UI**: [http://localhost:4001/docs](http://localhost:4001/docs)

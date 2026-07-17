# Svelte 5 LMS Web Frontend

The frontend user interface for the LMS Online Coding Platform. It provides pages and features for browsing courses, participating in quizzes, interacting with AI coding interviews, and tracking user profile progress.

---

## Technologies Used

- **Svelte 5**: Utilizing the modern rune-based reactive model.
- **SvelteKit**: Application framework for routing, hydration, and pages.
- **Bun Runtime**: Ultra-fast JS parser, package manager, and test runner.
- **Tailwind CSS v4**: Utility-first CSS framework for layout styling.
- **TypeScript**: Typed JavaScript flavor for robust codebase compilation.
- **Vite**: Frontend build tool and development server.
- **Vitest**: Unit testing framework with browser/playwright capabilities.

---

## Getting Started & Setup

Follow these steps to configure and run the Web Frontend service locally.

### Prerequisites

Ensure you have **Bun** installed as the primary Javascript runtime.
- **Install Bun**:
  ```bash
  curl -fsSL https://bun.sh/install | bash
  ```
  *(Restart your terminal or source your shell config after installing).*

---

### Step 1: Initialize the Environment

1. Navigate to the frontend directory:
   ```bash
   cd src/frontend
   ```

2. Install the locked dependencies using Bun:
   ```bash
   bun install
   ```

---

### Step 2: Running Development Server

Start Vite's development server locally:

```bash
bun run dev
```

The application will launch on [http://localhost:5173](http://localhost:5173). To open it automatically in your default browser on startup, run:
```bash
bun run dev -- --open
```

---

### Step 3: Production Build

Compile and optimize the frontend for production deployment:

```bash
# 1. Build the production assets
bun run build

# 2. Preview the production build locally
bun run preview
```

---

## Development & Utility Commands

| Command | Description |
|---------|-------------|
| `bun run dev` | Starts Vite's dev server on port `5173` |
| `bun run build` | Compiles optimized static/SSR production output |
| `bun run preview` | Spins up a local preview server for built assets |
| `bun run check` | Runs Svelte compiler check and TypeScript validation |
| `bun run lint` | Lints code using ESLint and runs Prettier validation |
| `bun run format` | Auto-formats code files using Prettier |
| `bun run test` | Runs unit and component tests via Vitest |

---

## Environment Configuration

If you need to configure frontend endpoints, create a `.env` file in the `src/frontend` folder. Vite automatically injects environment variables prefixed with `VITE_` into your application client bundle:

```env
VITE_API_URL=http://localhost:4000/api/v1
```

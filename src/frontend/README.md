# React LMS Web Frontend

The React frontend user interface for the LMS Online Coding Platform. It provides pages and features for browsing courses, participating in quizzes, interacting with AI coding interviews, and tracking user profile progress.

---

## Technologies Used

- **React 19**: Modern component library for interactive views.
- **Vite**: Frontend build tool and development server.
- **Tailwind CSS v4**: Modern, high-performance styling engine.
- **TypeScript**: Statically typed JavaScript for safety.
- **Bun**: Fast JavaScript runtime and package manager.

---

## Target Folder Structure

The frontend follows this feature-based target architecture. Each feature owns
its API functions, state/types, reusable components, and route-level pages.

```text
frontend/
├── public/
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── app/                          # Application bootstrap and global setup
│   │   ├── App.tsx
│   │   ├── router/
│   │   │   ├── appRoutes.tsx
│   │   │   ├── roleGuard.tsx
│   │   │   └── routePaths.ts
│   │   ├── layouts/
│   │   └── styles/
│   │       ├── globals.css
│   │       └── tokens.css
│   ├── assets/
│   │   ├── images/
│   │   ├── fonts/
│   │   └── icons/
│   ├── components/
│   │   ├── ui/                       # shadcn/ui primitives
│   │   └── common/                   # Shared UI across multiple features
│   │       ├── siteHeader.tsx
│   │       ├── siteFooter.tsx
│   │       └── scrollToTop.tsx
│   ├── features/
│   │   ├── auth/
│   │   ├── courses/
│   │   ├── student/
│   │   ├── teacher/
│   │   ├── admin/
│   │   ├── classroom/
│   │   ├── quiz/
│   │   ├── judge/
│   │   ├── payment/
│   │   ├── interview/
│   │   ├── instructor/
│   │   └── notification/
│   │       ├── api/                  # Feature endpoint functions
│   │       ├── model/                # Types, validation, and state
│   │       ├── components/            # Feature-specific UI
│   │       ├── pages/                 # Route-level feature screens
│   │       └── index.ts               # Feature public exports
│   ├── hooks/
│   │   ├── api/                       # React hooks that connect FE to BE APIs
│   │   ├── context/                   # React contexts when required
│   │   ├── useDebounce.ts
│   │   └── useDisclosure.ts
│   ├── services/
│   │   └── api/
│   │       ├── client.ts              # Axios instances and interceptors
│   │       └── httpError.ts
│   ├── lib/
│   │   ├── cn.ts
│   │   ├── format.ts
│   │   └── validators.ts
│   ├── types/
│   │   ├── api.ts                     # Shared API/pagination types
│   │   └── common.ts
│   ├── main.tsx
│   └── viteEnv.d.ts
├── tests/
│   ├── setup.ts
│   ├── factories/
│   └── integration/
├── .env
├── .env.example
├── index.html                         # Vite entry point
├── package.json
├── vite.config.ts
└── README.md
```

Use `import.meta.env.VITE_*` to read Vite environment variables. Keep domain
types and API calls inside their feature; `src/types` and `src/services/api`
are reserved for shared types and HTTP infrastructure.

---

## Getting Started & Setup

Ensure you have **Bun** installed as the primary runtime.

### Step 1: Install Dependencies

Navigate to the frontend folder and install:

```bash
cd src/frontend
bun install
```

### Step 2: Run Development Server

Run Vite's local hot-reloaded dev environment:

```bash
bun run dev
```

The application will launch on [http://localhost:5173](http://localhost:5173).

### Step 3: Production Build

Verify typescript checks and bundle the app:

```bash
# Compile and build production assets
bun run build

# Preview the built production output locally
bun run preview
```

---

## Utility Commands

| Command           | Description                                            |
| ----------------- | ------------------------------------------------------ |
| `bun run dev`     | Starts Vite's dev server on port `5173`                |
| `bun run build`   | Compiles code with `tsc` and bundles production assets |
| `bun run preview` | Spins up local HTTP server to preview `/dist` output   |
| `bun run lint`    | Lints typescript and React hooks syntax with ESLint    |

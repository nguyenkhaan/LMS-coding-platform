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

## Folder Structure

Following clean architectural patterns for React:

```text
src/
├── assets/         # Project images, icons, and static assets
├── components/     # Reusable presentation and UI components
│   ├── common/     # Global layout components (Header, Footer, etc.)
│   └── ui/         # Base design system primitives (Buttons, Inputs, etc.)
├── hooks/          # Custom reusable React hooks
├── pages/          # Page components mapping to application views
├── services/       # Client API fetch calls and service helpers
├── utils/          # Formatting tools and helper constants
├── App.tsx         # Main entry component
├── index.css       # Global styles (Tailwind CSS imports)
├── main.tsx        # React client bootstrap entry point
└── vite-env.d.ts   # Vite environment variables declarations
```

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

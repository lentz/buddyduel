# AGENTS.md

## Overview

This repo is a small full-stack monorepo with two main apps:

- `api/`: Express + TypeScript server built around MongoDB via Mongoose
- `client/`: Angular app for the browser UI

The backend is the source of business logic, while the client mostly renders data and calls REST endpoints under `/api`.

## Running the project

Install dependencies for each app:

```bash
cd api && npm ci
cd client && npm ci
```

Run the API locally:

```bash
cd api && npm run build
node dist/server.js
```

Or use the docker-compose stack in the repo root:

```bash
docker compose up --build
```

## Build, lint, and test commands

API (`api/package.json`):

```bash
cd api
npm run build        # tsc
npm run lint         # biome check --error-on-warnings
npm run test         # DATABASE_NAME=test node --test --test-force-exit
npm run test:watch   # node --watch --test
npm run typecheck    # tsc --watch --noEmit
```

Single API test:

```bash
cd api && DATABASE_NAME=test node --test src/lib/betResult.test.ts --test-force-exit
cd api && DATABASE_NAME=test node --test integration-tests/duels.test.ts --test-force-exit
```

Client (`client/package.json`):

```bash
cd client
npm run build        # ng build --configuration development
npm run build:prod   # ng build
npm run lint         # ng lint
npm run cy:run       # Cypress E2E run
npm run cy:open      # Cypress UI
```

CI runs the same checks in both apps (`.github/workflows/ci.yml`): install deps, lint, build, API tests, and Cypress E2E.

## Architecture

### Backend structure

- `api/src/app.ts`: creates the Express app, sets up session middleware, loads env config, and mounts `/api` routes.
- `api/src/routes.ts`: central route map. It enforces a session check for most endpoints and routes to controller handlers.
- `api/src/controllers/*.ts`: request/response handlers and business flow; keep route logic here rather than embedding it in models.
- `api/src/services/*.ts`: domain logic that does more than simple CRUD, such as `DuelWeekUpdater` and odds integration.
- `api/src/models/*.ts`: Mongoose schemas and typed models; this repo uses MongoDB documents for duels, players, and related entities.
- `api/src/lib/*.ts`: low-level utilities and reusable logic such as DB initialization, logging, and helper functions.
- `api/src/jobs/*.ts`: background jobs or scheduled tasks.
- `api/src/config.ts`: validates environment variables with `zod` before the server starts.

The API expects a MongoDB instance and session-backed login state. Most routes require `req.session.userId` and `req.session.userName`, with only auth/logout endpoints intentionally excluded from the session gate.

### Frontend structure

- `client/src/app`: Angular feature modules/components. The app is organized by domain areas such as `duels`, `duel-weeks`, `home`, `nav`, and `user-profile`.
- `client/src/app/*/*.service.ts`: HTTP client wrappers that call `/api/...` endpoints.
- `client/src/environments`: environment-specific values used by the browser.
- `client/src/proxy.conf.mjs`: local dev proxy config for API requests.

### Data flow

A common pattern is:

1. Angular component loads a service
2. service calls an HTTP route under `/api`
3. Express controller reads session cookies and queries MongoDB models
4. Mongoose models shape the persisted data; the response is returned as JSON

## Key conventions

- This repo uses TypeScript in both apps and keeps imports explicit; in API files, imports often include the `.ts` extension for local modules.
- Backend tests are written with Node’s built-in test runner (`node:test`) and `supertest` for HTTP requests. Test files live adjacent to source (`*.test.ts`) or under `api/integration-tests/`.
- Environment configuration is validated at startup via `api/src/config.ts`; new config keys should be added there and reflected in CI environment variables when needed.
- Session auth is central to the API: `app.use('/api', routes)` is behind a session check in `api/src/routes.ts`.
- Mongoose schemas use explicit enums and timestamps where applicable, and domain objects generally model `status` states as strings like `'pending' | 'active' | 'suspended'`.
- Client code uses Angular services and `inject()` rather than constructor-based DI for many feature classes.
- This project is a real monorepo but not a package-managed workspace; each app has its own `package.json` and installs independently.

## Notes for future changes

- When altering the API contract, keep the Angular service layer and the response shape in sync.
- When introducing new environment variables, update `api/src/config.ts` and CI env definitions in `.github/workflows/ci.yml`.
- Prefer existing project patterns: controllers for route logic, services for cross-cutting/complex behavior, and models for persistence shape.

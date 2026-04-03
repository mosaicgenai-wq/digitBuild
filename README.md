# DigitBuild Platform

React + Node.js implementation of the DigitBuild website, organized as a product-style monorepo.

## Tech Stack

- Frontend: React, TypeScript, Vite, React Router, Framer Motion
- Backend: Node.js, Express, TypeScript
- Package management: npm workspaces

## Project Structure

```text
digitBuild/
├─ apps/
│  ├─ web/              # React frontend
│  │  ├─ src/
│  │  │  ├─ components/
│  │  │  ├─ pages/
│  │  │  ├─ lib/
│  │  │  └─ styles/
│  └─ api/              # Express backend
│     └─ src/
├─ package.json         # Root workspace scripts
└─ README.md
```

## Prerequisites

Make sure these are installed on your system:

- Node.js `18+`
- npm `9+`

To check:

```powershell
node -v
npm -v
```

If `npm` does not work in PowerShell on your machine, use `npm.cmd` instead of `npm`.

## Installation

From the project root:

```powershell
npm install
```

If needed:

```powershell
npm.cmd install
```

This installs dependencies for both:

- `apps/web`
- `apps/api`

## Run In Development

Start frontend and backend together:

```powershell
npm run dev
```

This will start:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

The frontend is configured to proxy `/api` requests to the backend during development.

## Build For Production

Run:

```powershell
npm run build
```

This will:

- build the React app into `apps/web/dist`
- compile the Node backend into `apps/api/dist`

## Run In Production

After building, start the backend server:

```powershell
npm run start
```

Open:

```text
http://localhost:3000
```

In production mode, the Express server serves:

- API routes
- built frontend files

## Useful Scripts

Root-level scripts:

- `npm run dev` : run frontend + backend together
- `npm run build` : build frontend + backend
- `npm run start` : start production backend
- `npm run lint` : type-check both apps

Workspace-specific examples:

```powershell
npm run dev --workspace apps/web
npm run dev --workspace apps/api
npm run build --workspace apps/web
npm run build --workspace apps/api
```

## Available Routes

Frontend pages:

- `/`
- `/courses`
- `/career`
- `/technology-services`
- `/about`
- `/contact`
- `/blog`

Legacy route:

- `/placement-services` redirects to `/`

## Backend API

### Health Check

```http
GET /api/health
```

Response:

```json
{
  "status": "ok"
}
```

### Contact Form

```http
POST /api/contact
Content-Type: application/json
```

Example body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "subject": "Course Inquiry",
  "message": "I want to know more about the Full Stack course."
}
```

## Customization Notes

- Main theme colors are in `apps/web/src/styles/global.css`
- Homepage content is in `apps/web/src/pages/HomePage.tsx`
- Courses page is in `apps/web/src/pages/CoursesPage.tsx`
- Career page is in `apps/web/src/pages/CareerPage.tsx`
- Contact API is in `apps/api/src/server.ts`

## Troubleshooting

### npm not recognized

Use:

```powershell
npm.cmd install
npm.cmd run dev
```

### Port already in use

Change the app port in:

- frontend: `apps/web/vite.config.ts`
- backend: `apps/api/src/server.ts`

### Build check

To verify everything is compiling:

```powershell
npm run build
```

## Current Scope

This project currently includes:

- product-style React frontend
- Express backend
- contact API
- career page
- blog page
- course-specific WhatsApp buttons
- dark/light theme support

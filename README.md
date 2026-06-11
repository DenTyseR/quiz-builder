# Quiz Builder

Full-stack quiz builder with a NestJS API, Prisma + SQLite persistence, and a Next.js frontend.

## Project Structure

```text
quiz-builder/
├── backend/   # NestJS API, Prisma schema, SQLite database setup
└── frontend/  # Next.js React app
```

## Requirements

- Node.js 20+
- npm

## Backend Setup

```bash
cd backend
npm install
copy .env.example .env
npm run prisma:generate
npm run db:migrate
npm run db:seed
npm run start:dev
```

The backend runs at `http://localhost:3000` by default.

Backend `.env`:

```env
DATABASE_URL="file:./dev.db"
FRONTEND_URL="http://localhost:3001"
PORT=3000
```

## Frontend Setup

```bash
cd frontend
npm install
copy .env.example .env.local
npm run dev
```

The frontend runs at `http://localhost:3001`.

Frontend `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL="http://localhost:3000"
```

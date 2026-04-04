# OpsFlow

A full-stack productivity and workflow automation platform built with Next.js, Prisma, and PostgreSQL.

## Features

- **Task Management** — Create, update, and organize tasks with Kanban boards
- **Project Management** — Group tasks into projects
- **Workflow Automation** — Create automated workflows triggered by task events
- **AI-Powered** — Natural language workflow generation (OpenAI with smart fallback)
- **Analytics Dashboard** — Track productivity and activity trends
- **Authentication** — JWT-based auth with signup/login

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL with Prisma 7
- **Styling**: Tailwind CSS 4 + custom retro-futuristic design system
- **Auth**: JWT (jsonwebtoken + bcryptjs)
- **AI**: OpenAI API (optional, with built-in fallback)

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/ary0912/opsflow.git
   cd opsflow
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your database URL and a secure JWT secret.

5. Run database migrations:
   ```bash
   npx prisma migrate deploy
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Deploy on Vercel

1. Push to GitHub
2. Import the repo on [Vercel](https://vercel.com)
3. Add environment variables (`DATABASE_URL`, `JWT_SECRET`) in Vercel dashboard
4. Deploy — the build script automatically runs `prisma generate`

> **Note**: You need a cloud-hosted PostgreSQL database (e.g., [Neon](https://neon.tech), [Supabase](https://supabase.com)) for production.

## Environment Variables

See [`.env.example`](.env.example) for all required and optional variables.

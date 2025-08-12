# Habit Tracker

A simple habit tracking app built with [Next.js](https://nextjs.org), [Prisma](https://www.prisma.io/), and Tailwind CSS.

## Features

- Track daily habits and streaks
- View progress and completion stats
- Calendar view for habit completions
- Quick start habit suggestions

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up the database:**
   ```bash
   npx prisma migrate dev
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `/src/app` - Next.js app routes and components
- `/src/lib` - Utility libraries (e.g., Prisma client)
- `/prisma` - Prisma schema and migrations
- `/public` - Static assets
- `/temp` - HTML prototype

## Tech Stack

- Next.js
- Prisma ORM
- PostgreSQL (default, configurable)
- Tailwind CSS

## Deployment

Deploy easily on [Vercel](https://vercel.com/) or your preferred platform.

### fit-flow

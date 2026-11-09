# GLUNS Website

The official website and delegation portal for the **Global Leaders United Nations
Symposium (GLUNS)**.

GLUNS connects students, schools, and youth leaders through Model United Nations
conferences, diplomacy education, leadership programmes, and international
collaboration.

## What the platform provides

- Public information about GLUNS, its organs, Secretariat, events, FAQs, sponsors,
  and contact channels
- Event and school delegation registration
- Individual delegate registration
- Secure sign-in, account recovery, and account settings
- Delegation management, delegate records, assignments, payments, and receipts
- Payload CMS administration for managing events, profiles, media, and site content

## Technology

- Next.js and React
- TypeScript
- Payload CMS
- PostgreSQL
- Tailwind CSS
- Vitest and Playwright

## Local development

### Requirements

- Node.js 18.20.2 or newer
- npm or pnpm
- PostgreSQL

### Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a local environment file:

   ```bash
   cp .env.example .env
   ```

3. Configure the database, Payload secret, application URL, and payment/email
   settings in `.env`.

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

The Payload admin panel is available at `/admin`.

## Useful commands

```bash
npm run dev       # Start the development server
npm run build     # Create a production build
npm run start     # Serve the production build
npm run lint      # Run ESLint
npm run test:int  # Run integration tests
npm run test:e2e  # Run Playwright end-to-end tests
```

## Docker

Docker support is available through the project’s `docker-compose.yml`. Configure
the required environment variables first, then run:

```bash
docker compose up
```

## Project structure

- `src/app/(frontend)` — public GLUNS pages and authenticated portal routes
- `src/components` — reusable page sections, forms, and portal components
- `src/collections` — Payload CMS collections
- `src/data` — data fetching helpers for events, committees, Secretariat members,
  and sponsors
- `src/app/api` — application API routes
- `tests` — integration and end-to-end tests

## Content management

Site administrators manage GLUNS content through Payload CMS. Keep event details,
committee descriptions, Secretariat profiles, sponsor information, and media
updated so the public website reflects the current programme.

## Support

For GLUNS website or registration support, contact the relevant team through the
official contact channels listed on the website.

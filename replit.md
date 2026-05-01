# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Tribute Project (غدّوش)

Cinematic Arabic tribute webpage for a digital content creator (غدّوش, born 15 May 1996).

### Artifacts
- **`artifacts/tribute`** (`@workspace/tribute`) — React + Vite frontend, serves at `/`
- **`artifacts/api-server`** (`@workspace/api-server`) — Express 5 API, serves at `/api`

### Tribute Features
- 14 cinematic scenes with per-scene background gradients, glass cards, text animations
- Background music: `artifacts/tribute/public/tribute-song.mp3` (Hauran folk song)
- Single hero photo: `attached_assets/FB_IMG_1777583498554_1777583587493.jpg`
- Like button, message form (textarea → POST /api/tribute/message), Facebook link with share tracking
- Visit tracking on page load (POST /api/tribute/visit)
- Admin panel at `/#admin` (hash routing, no separate route)

### Admin Panel
- URL: `/#admin` — password-protected (default password: `admin2026`, env var `ADMIN_PASSWORD` overrides)
- Shows stats: visits, likes, messages, shares
- Lists and allows deletion of user messages
- Settings tab: upload new hero image/song, edit text fields
- Uploaded files land in `artifacts/tribute/public/uploads/`

### DB Tables (lib/db)
- `tribute_visits` — visit records with IP/user-agent
- `tribute_likes` — like records
- `tribute_messages` — user-written messages
- `tribute_shares` — Facebook link click records
- `tribute_settings` — key/value settings (songUrl, heroImageUrl, text fields)

### API Routes (`/api/tribute/`)
- `POST /visit`, `/like`, `/message`, `/share` — public tracking
- `GET /settings` — public settings
- `POST /admin/verify` — validate admin password
- `GET /admin/stats`, `/admin/messages`, `/admin/visits` — admin reads (header: x-admin-password)
- `DELETE /admin/messages/:id` — delete message
- `PUT /admin/settings` — update settings
- `POST /admin/upload/image`, `/admin/upload/song` — file uploads

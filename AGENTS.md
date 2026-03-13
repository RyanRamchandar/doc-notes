# AGENTS.md

## Cursor Cloud specific instructions

### Overview

Doc Notes is a single Next.js 15 application (TypeScript, Tailwind CSS v4, shadcn/ui). No database, no Docker, no auth. Sessions are stored in browser `localStorage`. See `README.md` for full architecture and local development docs.

### Running the app

```bash
cp .env.example .env.local   # only needed once; already present in snapshots
npm run dev                   # starts on port 3000
```

Set `NEXT_PUBLIC_FORCE_MOCK=true` in `.env.local` to bypass Deepgram and browser speech recognition, enabling full demo mode without API keys or microphone hardware.

### Available scripts

See `package.json` for the canonical list: `npm run dev`, `npm run lint`, `npm run typecheck`, `npm run build`.

### Gotchas

- **No test framework**: There is no `test` script or test runner configured. Lint and typecheck are the primary automated checks.
- **No microphone in cloud VMs**: The mock STT client (`src/lib/stt/mock-live-client.ts`) calls `getUserMedia()` even in demo mode, which will fail without audio hardware. The app still creates sessions and generates mock transcripts, but the recording start flow may surface a browser permission error in headless environments.
- **Port conflicts**: The dev server defaults to port 3000 but will auto-increment if occupied (Next.js behavior).
- **External API keys are optional**: `OPENROUTER_API_KEY` and `DEEPGRAM_API_KEY` are not required. The app falls back to mock note generation and mock/browser STT respectively.

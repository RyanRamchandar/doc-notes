# Doc Notes

Doc Notes is a fast prototype medical AI scribe web app built with Next.js, TypeScript, Tailwind, and shadcn-style components.

It focuses on the top scribe workflow first:

- record a visit from the browser microphone
- stream live transcription with interim/final states
- generate a structured clinical note or SOAP note
- edit, copy, and export the note
- persist sessions locally in `localStorage`

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn-style component primitives
<<<<<<< HEAD
- Deepgram live transcription with browser speech fallback
=======
- Deepgram live transcription
>>>>>>> origin/main
- OpenRouter note generation
- localStorage persistence

## Prototype architecture

### Front end

- `/` workspace landing page with recent local sessions
- `/sessions/[sessionId]` session workspace for recording, transcript review, and note editing

### Provider isolation

- `src/lib/stt/*` contains the transcription layer
- `src/lib/llm/*` contains prompt and note generation logic
- `src/app/api/stt/token/route.ts` can mint short-lived Deepgram browser tokens
- `src/app/api/notes/generate/route.ts` proxies note generation through OpenRouter

### Persistence

- No database
- No auth
- Sessions are stored only in browser `localStorage`

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the env template:

   ```bash
   cp .env.example .env.local
   ```

3. Add the credentials you want to use:

   - `OPENROUTER_API_KEY` for real note generation
   - `DEEPGRAM_API_KEY` for server-issued short-lived browser tokens
   - optionally `NEXT_PUBLIC_DEEPGRAM_API_KEY` for browser-only quick demos

4. Start the app:

   ```bash
   npm run dev
   ```

5. Open `http://localhost:3000`

## Environment variables

### Recommended

Use server-side secrets with:

- `OPENROUTER_API_KEY`
- `OPENROUTER_MODEL`
- `DEEPGRAM_API_KEY`

This is the preferred setup for local development and Vercel deployment.

### Optional browser-only fallback

You can set:

- `NEXT_PUBLIC_DEEPGRAM_API_KEY`

That allows direct browser auth to Deepgram if you do not want to use the token route yet. This is only for quick demos and is not production-safe.

<<<<<<< HEAD
If Deepgram is unavailable at runtime, the app next attempts browser-native speech recognition when the browser supports it.

=======
>>>>>>> origin/main
### Demo mode

If credentials are missing:

<<<<<<< HEAD
- transcription falls back to browser-native speech recognition when available, then to a mock live transcript flow
=======
- transcription falls back to a mock live transcript flow
>>>>>>> origin/main
- note generation falls back to a mock structured note when `OPENROUTER_API_KEY` is absent

You can also force mock transcription with:

- `NEXT_PUBLIC_FORCE_MOCK=true`

<<<<<<< HEAD
That bypasses both Deepgram and browser-native speech recognition.

=======
>>>>>>> origin/main
## Scripts

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
```

## Current behavior

### Workspace

- branded landing screen
- start new recording CTA
- recent local session cards

### Session workspace

- start / pause / resume / stop recording controls
- status badge and elapsed timer
- audio input meter
- live transcript UI with interim/final styling
- speaker badges when available
- clinical note / SOAP note toggle
- editable structured note output
- copy note
- export `.txt`
- export `.md`

## Deployment recommendation

Deploy to **Vercel**.

Why:

- App Router support
- route handlers work without extra infrastructure
- OpenRouter can stay server-side
- Deepgram token minting can stay server-side
- easiest path to a shareable demo

### Vercel setup

1. Import the repo into Vercel
2. Add:
   - `OPENROUTER_API_KEY`
   - `OPENROUTER_MODEL`
   - `DEEPGRAM_API_KEY`
3. Deploy with the default Next.js settings

## Security and production notes

This project is intentionally prototype-first.

### Safe enough for prototype

- OpenRouter is called through a server route by default
- Deepgram can be used through a short-lived token route

### Not production-safe

- storing any long-lived provider key in a `NEXT_PUBLIC_*` variable
- relying on browser-only provider access
- storing sensitive visit data in browser `localStorage`

### Production next steps

- move session storage to a real backend/database
- add authentication and role controls
- proxy all provider calls server-side
- add audit logging and proper compliance boundaries
- add stronger note review and transcript QA workflows

## Tradeoffs

- optimized for speed of iteration over production hardening
- localStorage keeps setup simple but is not durable or secure
- editable textareas are intentionally simple instead of a richer editor
- provider abstractions are thin on purpose so the MVP stays easy to understand

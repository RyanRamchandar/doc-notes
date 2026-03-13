# Doc Notes

Doc Notes is a prototype medical AI scribe app built with Next.js, TypeScript, Tailwind, and shadcn-style UI primitives.

It focuses on the core workflow:

- record a visit from the browser microphone
- stream live transcription with interim and final updates
- generate a structured clinical note or SOAP note
- edit, copy, and export the draft
- persist sessions locally in `localStorage`

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn-style component primitives
- Deepgram live transcription
- browser speech-recognition fallback
- OpenRouter note generation
- localStorage persistence

## Architecture

### Front end

- `/` is the landing workspace with recent local sessions
- `/sessions/[sessionId]` is the main recording, transcript, and note-editing workspace

### Provider isolation

- `src/lib/stt/*` contains transcription clients and orchestration
- `src/lib/llm/*` contains prompt and note generation logic
- `src/app/api/stt/token/route.ts` mints short-lived Deepgram browser tokens
- `src/app/api/notes/generate/route.ts` proxies note generation through OpenRouter

### Persistence

- no database
- no auth
- sessions are stored only in browser `localStorage`

## Local development

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
   - `OPENROUTER_MODEL` to override the default model
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

This is the preferred setup for local development and Netlify deployment.

### Optional browser-only fallback

You can set:

- `NEXT_PUBLIC_DEEPGRAM_API_KEY`

That allows direct browser auth to Deepgram if you do not want to use the token route yet. This is only for quick demos and is not production-safe.

### Runtime fallback behavior

If Deepgram is unavailable at runtime, the app falls back in this order:

1. Deepgram live transcription
2. browser-native speech recognition when supported
3. mock/demo transcription

If `OPENROUTER_API_KEY` is absent, note generation falls back to a mock structured note.

You can also force mock transcription with:

- `NEXT_PUBLIC_FORCE_MOCK=true`

That bypasses both Deepgram and browser speech recognition.

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
- provider mode badge
- clinical note / SOAP note toggle
- editable structured note output
- copy note
- export `.txt`
- export `.md`

## Roadmap

This roadmap is based on the feature shape of Heidi Scribe and adapted to the current scope of this project. See [Heidi Scribe](https://www.heidihealth.com/en-ca/scribe) for the reference product direction.

### Completed in this prototype

- browser-based visit recording
- live transcription with Deepgram
- browser speech-recognition fallback when Deepgram is unavailable
- mock/demo fallback when live STT is unavailable
- structured note generation with OpenRouter
- Clinical Note and SOAP Note formats
- editable note workspace
- copy and export flows
- local session history in browser storage
- simple provider-status diagnostics for deployed environments

### Next up

- improve live transcript reliability and visibility of connection errors
- support more note styles and specialty-specific templates
- generate referral letters, patient summaries, and handouts from the same transcript
- improve note quality controls so output better matches clinician voice and formatting preferences
- add richer transcript review tools, including better speaker handling and transcript correction

### Before the consult

- patient chart summary view with prior notes, results, and visit context
- schedule-aware workspace that pulls the next patient or consult into focus
- pre-visit preparation panel with important findings and recent changes

### During the consult

- broader language support for live transcription
- stronger specialty adaptation across family medicine, specialist, mental health, nursing, allied health, dental, and veterinary workflows
- customizable documentation templates that match individual clinician style
- structured capture for diagnoses, problems, medications, follow-ups, and clinical tasks

### After the consult

- one-click export into an EHR or downstream clinical system
- coding suggestions and task extraction
- automated referral and form generation
- patient-facing follow-up summaries and visit handouts

### Platform features

- evidence and clinical reference support inside the note-writing workflow
- communication workflows for confirmations and follow-up messages
- auth, team spaces, and shared template libraries
- audit logging, compliance controls, and stronger deployment security
- backend persistence instead of browser-only local storage

## Deployment

Deploy to **Netlify**.

Why:

- Next.js support works well for this prototype
- route handlers run as Netlify Functions
- OpenRouter stays server-side
- Deepgram token minting stays server-side
- easy path to a shareable demo URL

### Netlify setup

1. Import the repo into Netlify.
2. Add these environment variables in **Site settings → Environment variables**:
   - `OPENROUTER_API_KEY`
   - `OPENROUTER_MODEL`
   - `DEEPGRAM_API_KEY`
   - optionally `NEXT_PUBLIC_DEEPGRAM_API_KEY`
   - optionally `NEXT_PUBLIC_FORCE_MOCK`
3. Make sure server-side secrets are available to Functions at runtime.
4. Deploy with the default Next.js build settings.

### Provider status check

The app includes:

- `/api/providers/status`

This returns whether `OPENROUTER_API_KEY` and `DEEPGRAM_API_KEY` are visible to the deployed server environment.

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

- move session storage to a real backend or database
- add authentication and role controls
- proxy or harden all provider calls server-side
- add audit logging and compliance boundaries
- add stronger transcript QA and note review workflows

## Tradeoffs

- optimized for speed of iteration over production hardening
- localStorage keeps setup simple but is not durable or secure
- editable textareas are intentionally simple instead of a richer editor
- provider abstractions are intentionally thin so the MVP stays easy to understand

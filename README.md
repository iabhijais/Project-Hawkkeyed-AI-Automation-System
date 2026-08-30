# 🦅 Project Hawkkeyed

**AI workflow automation — documents, web pages, data and conversations in, structured reports out.**

Built for the AI Genesis Hackathon, November 2025.
Live: **https://hawkkeyed.vercel.app**

---

## What it does

Four workflows, all running the same two-stage pipeline:

| Workflow | Input | Output |
|---|---|---|
| **Document Intelligence** | Pasted text or an uploaded PDF/image | Summary, action items with priorities, key points |
| **Web Extraction** | A URL — fetched and read server-side | Summary, key facts, opportunities/risks/entities/actions |
| **Data Insights** | CSV or structured data | Insights, recommendations, a rendered chart |
| **Smart Assistant** | A conversation | A professional email draft |

Every run produces a downloadable PDF.

## The pipeline

```
input ──► [1] Structured extraction ──► strict JSON
              gemini-2.5-flash              │
                                            ▼
          [2] Report generation ──────► markdown report
              gemini-2.5-flash
```

Two calls, not one. The first pass is constrained to return JSON so the UI has typed fields to render — key facts, priorities, chart data. The second pass takes that JSON plus the original input and writes prose. Splitting them is what makes the output renderable instead of a wall of text.

Files and images are sent to the model as `inlineData` with their real mime type, so PDFs and screenshots are read natively rather than being pre-parsed.

**The UI shows the real pipeline.** Each stage is timed around its actual call, and a stage that is skipped or fails says so. If the URL fetch fails, you see it fall back to treating your input as text — the timeline is not decoration.

## Tech stack

- **Next.js 16** (App Router) + React 19, TypeScript
- **Google Gemini 2.5 Flash** via `@google/generative-ai` — the only model used
- **Tailwind CSS 4**, Framer Motion
- **Chart.js** for data visualisation, **jsPDF** for export
- Deployed on **Vercel**

### Where state lives

Run history and analytics are stored in **browser `localStorage`**, capped at the last 100 runs. There is no database and no account system — history is per-device, and clearing site data clears it. For a demo this is a deliberate trade: no auth, no backend, nothing to leak.

## Running locally

```bash
npm install
```

Create `.env.local`:

```
GEMINI_API_KEY=your_key_here
```

Get a key from [Google AI Studio](https://aistudio.google.com/app/apikey). Then:

```bash
npm run dev
```

Open http://localhost:3000. Without a key the API returns a clear 503 rather than a confusing SDK error.

## Deploying

Push to GitHub and import the repo in Vercel. Add `GEMINI_API_KEY` under Settings → Environment Variables for all environments, then deploy. No other configuration is needed.

## Limits and guards

The `/api/run-workflow` endpoint is public and runs on a personal API key, so it enforces:

- **Rate limit** — 10 requests per minute per IP
- **Uploads** — 10 MB cap, and only PDF, plain text, CSV, Markdown, PNG, JPEG, WebP
- **URL fetching** — https only, 10s timeout, 2 MB cap, 50k characters after stripping markup, and private/loopback/link-local addresses are rejected (SSRF)
- **Errors** — messages are returned, stack traces are logged server-side only

## What it does not do

- No persistence across devices or browsers — `localStorage` only
- No authentication, no multi-user separation
- Web Extraction reads static HTML; it does not execute JavaScript, so client-rendered pages come back thin
- No streaming — you wait for both stages, typically a few seconds
- One model. Earlier drafts of this README described a Gemini → Claude chain and a Firestore backend; neither was ever wired up, and the dead modules have been removed rather than left to imply a system that did not exist.

## Repository layout

```
app/
  page.tsx                  workflow picker, run handler, history writes
  api/run-workflow/route.ts the pipeline: guards, URL fetch, both model calls
  analytics/  history/  settings/  documentation/
components/
  InputSection  OutputSection  PipelineTimeline  LiveStats  DataChart  …
lib/
  geminiClient.ts           prompts and both model stages
  fetchUrl.ts               server-side page retrieval with SSRF guards
```

---

*Built for the AI Genesis Hackathon, 2025.*

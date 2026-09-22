# ✂️ Tailor

**Your résumé, matched to the job.** Paste your résumé and a job description — Tailor scores your fit, shows exactly what's missing, and rewrites your résumé for that specific role, using only what's genuinely on it.

![Next.js 15](https://img.shields.io/badge/Next.js-15-000000?logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Claude](https://img.shields.io/badge/AI-Claude-D97757)
![SQLite](https://img.shields.io/badge/SQLite-003B57?logo=sqlite&logoColor=white)

---

## Highlights

- **Honest fit score** — a realistic 0–100 match of your résumé to the role, with a one-line verdict. Not flattery.
- **Gaps, spelled out** — what the JD wants that your résumé doesn't show yet, so you know what to strengthen before you apply.
- **Keyword-honest rewrite** — reordered and rephrased for the role using the JD's real terminology, and it never invents experience you don't have.
- **Streamed, not stalled** — the score and gaps appear in a couple of seconds while the tailored résumé writes in live, so a multi-second model call doesn't feel like a dead wait.
- **Freemium** — a few free tailors, then a Pro pass. Auth, billing (Razorpay) and quota are built in.

## How it works

`src/lib/tailor.ts` prompts Claude (Sonnet) for a single delimited response — a small header (fit score, verdict, matched, missing, changes) followed by the rewritten résumé. `src/app/api/tailor/route.ts` streams the model's text deltas straight to the browser; `src/components/TailorTool.tsx` parses the stream as it arrives, so the header renders immediately and the résumé fills in progressively. Every run is stored per-owner in SQLite and gated by a free-tier quota.

User input is treated as untrusted data, never instructions, and the rewrite is constrained to facts already in the résumé.

## Run it

```bash
npm install
cp .env.example .env.local   # add your ANTHROPIC_API_KEY
npm run dev
```

Open http://localhost:3000.

## Stack

Next.js 15 (App Router, server actions, a streaming route handler) · TypeScript · Tailwind · SQLite via `better-sqlite3` · hand-rolled sessions · Anthropic Claude · Razorpay for Pro.

Built by reusing the engine behind [Opportunity Hunter](https://opportunityhunter.xyz) — same auth, billing, database and Anthropic setup, pointed at a sharper problem.

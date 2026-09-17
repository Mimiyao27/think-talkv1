# ThinkTalk — Development Session Log
**Date:** September 16–18, 2026  
**App:** ThinkTalk: Turning Thoughts into Talk  
**Purpose:** A web-based intervention for reducing English language anxiety and improving oral classroom participation among Grade 7 students.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 16 (App Router) | Framework |
| React 19 | UI |
| TypeScript | Type Safety |
| Tailwind CSS v4 | Styling |
| Puter.js (`@heyputer/puter.js`) | Speech-to-Text + AI Evaluation |
| Supabase (`@supabase/supabase-js`, `@supabase/ssr`) | Database + Authentication |
| `lucide-react` | Icons |
| Browser MediaRecorder API | Microphone recording |

---

## Application Flow

```
Student opens ThinkTalk
    ↓
Redirected to /login (if not logged in)
    ↓
Sign up / Sign in with Supabase Auth
    ↓
/dashboard — Shows stats (Completed, Avg Score, Active Days) + recent attempts
    ↓
Click "Start Practice"
    ↓
/practice — Random exercise displayed
    ↓
Click mic button → Browser requests microphone permission
    ↓
Recording state (Cancel | Recording... | Save)
    ↓
Click Save → Audio Blob captured
    ↓
Processing state (spinner)
    ↓
Puter.js → speech2txt → Transcript
    ↓
Puter AI → evaluateResponse → JSON Evaluation
    ↓
Result card (Your Answer, Grammar, Meaning, Completeness, Relevance, Score, Feedback)
    ↓
Saved to Supabase (attempts + evaluations tables)
    ↓
Click "Try Another Exercise" → reload → new random exercise
```

---

## Stages Completed

### ✅ Stage 1 — UI + Microphone + MediaRecorder
- Set up Next.js app structure under `src/`
- Created `RecordingState` type: `idle | recording | processing | result`
- Built `MicrophoneButton.tsx` — big blue mic button
- Built `RecordingControls.tsx` — animated Recording... indicator + red Cancel + green Save
- Built `SpeechPractice.tsx` — main orchestrator of recording flow
- Exercise card uses **light yellow (#efebc4)** background with thick black border
- Recording state adds **purple border** to the card (matching reference images)

### ✅ Stage 2 — Puter.js Speech-to-Text
- Created `src/lib/speech.ts`
- Calls `puter.ai.speech2txt(audioBlob)` (Puter is a browser global, not a module)
- Transcript displayed after processing

### ✅ Stage 3 & 4 — AI Evaluation + Results UI
- Created `src/lib/ai-evaluation.ts`
- Dynamic prompt depending on exercise type (`fill-in-the-blank` vs `open-ended`)
- AI evaluates: Grammar, Meaning/Clarity, Completeness, Relevance
- Returns JSON with per-category status/feedback + overall score (0–100) + encouraging message
- Results card shows all categories with ✓ checkmarks, score in purple, overall feedback

### ✅ Stage 5 — Supabase Database
- Created `supabase/schema.sql` with tables: `exercises`, `attempts`, `evaluations`
- Row Level Security (RLS) enabled
- Created `src/app/actions/save-attempt.ts` — **Server Action** (keeps service role key off the browser)
- Saves attempt + evaluation after each successful speaking session

### ✅ Stage 6 — Authentication
- Installed `@supabase/ssr` for cookie-based session management
- Created `src/utils/supabase/server.ts` and `src/utils/supabase/client.ts`
- Created `/login` page with Email + Password form
- Created `src/app/login/actions.ts` — `login()`, `signup()`, `signout()` server actions
- Protected `/dashboard` and `/practice` routes (redirect to `/login` if not authenticated)
- `save-attempt.ts` now uses the real authenticated `user.id`

### ✅ Stage 7 — Real Dashboard Stats
- `/dashboard` fetches real attempts + evaluations from Supabase using the logged-in user's ID
- Calculates: **Exercises Completed**, **Average Score**, **Active Days**
- Shows **Recent Practice** list (last 3 sessions with scores)

### ✅ Open-ended Questions
- Added `type: "fill-in-the-blank" | "open-ended"` to the `Exercise` interface
- AI prompt dynamically adjusts based on exercise type
- Open-ended: evaluates clarity, grammar, relevance, completeness (no fixed answer comparison)
- Fill-in-the-blank: allows multiple valid answers, ignores exact word matching

---

## Final Exercise Pool (10 total)

| ID | Type | Question |
|---|---|---|
| 001 | fill-in-the-blank | Hi, everyone! I'm _______, but you can call me _______... |
| 002 | fill-in-the-blank | Yesterday, I went to the ______ with my friends. |
| 003 | open-ended | What did you do last weekend? |
| 004 | open-ended | What is your favorite subject in school and why? |
| 005 | open-ended | If you had a free day, what would you do? |
| 006 | open-ended | Describe your best friend. |
| 007 | open-ended | What do you usually do after school? |
| 008 | open-ended | What place would you like to visit and why? |
| 009 | open-ended | What is your favorite food? |
| 010 | open-ended | Describe your classroom. |

---

## File Structure Created

```
thinktalk/
├── supabase/
│   └── schema.sql                        ← Run this in Supabase SQL Editor
├── src/
│   ├── app/
│   │   ├── page.tsx                      ← Redirects to /dashboard
│   │   ├── login/
│   │   │   ├── page.tsx                  ← Login/Signup UI
│   │   │   └── actions.ts                ← login(), signup(), signout()
│   │   ├── dashboard/
│   │   │   └── page.tsx                  ← Student dashboard with real stats
│   │   ├── practice/
│   │   │   └── page.tsx                  ← Random exercise + SpeechPractice
│   │   └── actions/
│   │       └── save-attempt.ts           ← Server Action: saves to Supabase
│   ├── components/
│   │   ├── SpeechPractice.tsx            ← Main recording + evaluation flow
│   │   ├── MicrophoneButton.tsx          ← Blue mic button (idle state)
│   │   └── RecordingControls.tsx         ← Cancel | Recording... | Save
│   ├── lib/
│   │   ├── speech.ts                     ← Puter.js speech-to-text
│   │   ├── ai-evaluation.ts              ← Puter AI evaluation
│   │   └── supabase.ts                   ← Basic Supabase client (browser)
│   ├── types/
│   │   ├── student.ts                    ← RecordingState type
│   │   ├── exercise.ts                   ← Exercise interface
│   │   └── evaluation.ts                 ← EvaluationResult interface
│   └── utils/
│       └── supabase/
│           ├── server.ts                 ← SSR server client (cookies)
│           └── client.ts                 ← SSR browser client
└── .env.local                            ← Your Supabase keys (keep secret!)
```

---

## Environment Variables Required

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

> ⚠️ NEVER commit `.env.local` to GitHub. It is already in `.gitignore`.

---

## Key Bug Fixes

### `ai-evaluation.ts` Fix
- **Problem:** `import puter from "@heyputer/puter.js"` caused a TypeScript error because Puter.js is a **browser global**, not an ES module.
- **Fix:** Replaced with `declare const puter: any` and removed the import entirely.
- **Also fixed:** Nested backtick template literals that caused a syntax parse error. Prompt rebuilt as a `string[]` joined with `\n`.

---

## Supabase Setup Checklist

- [ ] Go to [supabase.com/dashboard](https://supabase.com/dashboard/projects)
- [ ] Create a new project
- [ ] Go to **SQL Editor** → paste contents of `supabase/schema.sql` → Run
- [ ] Go to **Authentication → Providers → Email** → Toggle **"Confirm email"** OFF (for easy testing)
- [ ] Copy **Project URL**, **anon key**, and **service_role key** from **Project Settings → API**
- [ ] Paste them into your `.env.local` file
- [ ] Restart the dev server: `npm run dev`

---

## How to Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
http://localhost:3000
```

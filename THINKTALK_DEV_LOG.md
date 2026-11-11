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
| AssemblyAI (`assemblyai`) | Real-time Speech-to-Text (WebSocket streaming) |
| Google Gemini 2.0 Flash (`@google/generative-ai`) | AI Evaluation (free tier, server-side) |
| Supabase (`@supabase/supabase-js`, `@supabase/ssr`) | Database + Authentication |
| `lucide-react` | Icons |
| Browser MediaRecorder API + Web Audio API | Microphone recording + PCM16 audio streaming |

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
Fetches temporary token from /api/assemblyai-token
    ↓
Opens WebSocket to AssemblyAI real-time API (wss://api.assemblyai.com/v2/realtime/ws)
    ↓
Recording state — streams PCM16 audio at 16 kHz via Web Audio API
    ↓
Live transcript appears (partial → final segments)
    ↓
Click Save → Audio streaming stops → AssemblyAI flushes last transcript
    ↓
Processing state (spinner)
    ↓
POST /api/evaluate → Gemini 2.0 Flash → JSON Evaluation
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

### ✅ Stage 8 — AssemblyAI Real-Time STT + Gemini Evaluation
**Date:** November 9, 2026

Replaced Puter.js (client-side, browser global) with a proper **server-side architecture** using **AssemblyAI** for speech-to-text and **Google Gemini 2.0 Flash** (free tier) for AI evaluation.

#### Speech-to-Text: AssemblyAI Streaming v3 WebSocket
- Created `GET /api/assemblyai-token` route (`src/app/api/assemblyai-token/route.ts`)
  - Auth-gated: checks Supabase session before issuing token
  - Calls AssemblyAI Streaming v3 token endpoint (`https://streaming.assemblyai.com/v3/token?expires_in_seconds=480`)
  - Keeps `ASSEMBLYAI_API_KEY` server-side only
- Updated `SpeechPractice.tsx` to use **AssemblyAI Streaming v3 WebSocket**:
  - Opens WebSocket to `wss://streaming.assemblyai.com/v3/ws?sample_rate=16000&token=...`
  - Captures microphone via `getUserMedia` + `AudioContext` (16 kHz sample rate)
  - Streams PCM16 audio via `ScriptProcessorNode`
  - Handles v3 `Turn` events (`transcript`, `end_of_turn: false` for partial ghost text, `end_of_turn: true` for final committed segments)
  - Sends `{ type: "Terminate" }` on cleanup to gracefully close session
- `src/lib/speech.ts` is now an empty placeholder (kept for potential future batch STT fallback)

#### AI Evaluation: Google Gemini 2.0 Flash (Free Tier)
- Installed `@google/generative-ai` package
- Created `POST /api/evaluate` route (`src/app/api/evaluate/route.ts`)
  - Receives `{ transcript, exerciseQuestion, exerciseType }` from client
  - Builds the same evaluation prompt (Grammar, Meaning, Completeness, Relevance)
  - Calls Gemini 2.0 Flash via `GoogleGenerativeAI` SDK
  - Parses and returns structured JSON evaluation
  - Keeps `GEMINI_API_KEY` server-side only
- Updated `src/lib/ai-evaluation.ts` — now calls `POST /api/evaluate` via `fetch()` instead of `puter.ai.chat()`

#### Cleanup
- Removed Puter.js `<script>` tag from `layout.tsx`
- Uninstalled `@heyputer/puter.js` package
- Added `GEMINI_API_KEY` to `.env.local`

#### Why This Change?
- **Security**: API keys are now server-side only (not exposed in the browser)
- **Reliability**: AssemblyAI provides higher-quality, real-time transcription with live feedback
- **Cost**: Gemini 2.0 Flash is free tier with generous limits
- **UX**: Students see their words appearing live as they speak (partial transcripts)

---

### Stage 9: Modern Landing Page with Navbar & Hero (GatherWish Design Reference)

Added a modern, friendly landing page at `/` inspired by the GatherWish UI reference provided by the user, tailored for Grade 7 English speaking practice.

#### Components Built:
1. **`LandingNavbar.tsx`**:
   - Sticky header with glassmorphism blur (`backdrop-blur-md bg-white/80`).
   - ThinkTalk brand mark with gradient microphone icon and live pulse indicator.
   - Smooth anchor navigation links to `#features`, `#how-it-works`, `#topics`, and `#curriculum`.
   - **Auth-Aware CTAs**: Automatically detects if the visitor is already authenticated via Supabase session. Displays "Dashboard" + "Start Practicing" for logged-in users, or "Sign In" + "Sign Up Free" + "Try Free Now" for guests.
   - Responsive mobile drawer menu with clean toggle transitions.

2. **`LandingHero.tsx`**:
   - **Badge Pill**: Soft pink tag `✨ Grade 7 English Speech Companion` with sparkle icon.
   - **Display Headline**: High-impact typography with the keyword **Confidence** highlighted in coral/rose with playful accent rays.
   - **Curriculum Icons Row**: 5 circular colored badge categories directly matching Grade 7 topics:
     - 🎓 School Life (Subjects & friends)
     - 🍕 Favorites (Food, drinks & places)
     - ⚽ Daily Routines (Hobbies & sports)
     - 💖 Feelings (Share joy & empathy)
     - ⭐ Free Speech (Open conversations)
   - **Dual CTAs**: Vibrant rose gradient rounded pill button (`Start Practicing Free →`) and video/how-it-works button (`▶ Watch How It Works`).
   - **Interactive Smartphone Mockup**:
     - Realistic phone shell with Dynamic Island / status bar.
     - Active practice session card with real-time waveform visualizer simulating AssemblyAI streaming.
     - Live transcript bubble: *"My favorite food is homemade pasta because..."*
     - Instant Gemini evaluation badge with 96/100 score and rubric breakdown.
     - Whimsical floating stickers around the device: cute yellow envelope badge (`💌 New Prompt`), student achievement polaroid (`🌟 Alex`), streak gift box (`🎁 5-Day Streak!`), and score tag (`Score: 96 / 100`).

3. **`LandingFeatures.tsx`**:
   - 6 capability highlight cards: Real-Time Streaming (AssemblyAI v3), Intelligent Gemini Multi-Model AI Evaluation, Grade 7 Curriculum Alignment, Gamified Scores & Streaks, Stress-Free Private Retries, and Preserved Transcripts on network failures.

4. **`LandingHowItWorks.tsx`**:
   - 3-step illustrated visual walkthrough (Choose Prompt → Tap Mic & Speak → Get Instant AI Feedback).
   - Bottom CTA banner with gradient styling encouraging immediate practice.

5. **`LandingTopics.tsx`**:
   - Interactive prompt preview tabs showing live Grade 7 question scaffolds (Food, Hobbies, Feelings, School Subjects) with sample recognized transcripts and AI scores.

6. **`LandingFooter.tsx`**:
   - Footer with navigation links, copyright, and technology attribution (AssemblyAI Streaming v3 & Google Gemini AI).

7. **`page.tsx` Updates**:
   - Replaced redirect to `/dashboard` with full landing page Server Component rendering.
   - Performs graceful server-side auth check via Supabase SSR without throwing errors if offline.

---

### Stage 10: "Register Account" Wireframe Popup Modal & Dashboard Integration

Added a popup registration modal designed exactly after the user's wireframe reference image (`media_1794378434631_dfe6fae9.png`).

#### Components Built & Enhanced:
1. **`src/components/RegisterModal.tsx`**:
   - **Wireframe Design Fidelity**:
     - Outer pill container: `rounded-[2.8rem] border-[3px] border-black bg-white shadow-2xl`
     - Title: `Register Account` (black bold centered font)
     - Fields:
       - **Firstname** (smooth pill input with `#c8d1d9` background)
       - **Lastname** (smooth pill input)
       - **Email Address** (smooth pill input)
       - **Password** (smooth pill input, min 6 characters)
       - **Confirm Password** (smooth pill input with matching validation)
     - Action Buttons:
       - **REGISTER** button (grey pill matching design with loading spinner)
       - **OR** divider
       - **Continue with Google** button (with official Google 'G' icon & OAuth redirect)
     - Mode toggle: Switch between "Register Account" and "Log In" right in the modal.
     - Escape key & outside-click backdrop dismissal.

2. **`src/components/DashboardHeader.tsx`**:
   - Upgraded dashboard header to an interactive component.
   - Features a **"Sign Up"** button directly on the dashboard that triggers the `RegisterModal` popup immediately on click.
   - Features a **"Sign Out"** button with quick session invalidation.

3. **`src/components/RegisterModalTrigger.tsx`**:
   - Reusable client button wrapper to pop up the registration modal from anywhere in the application.

4. **`src/app/auth/callback/route.ts`**:
   - App Router OAuth callback handler for exchanging Supabase OAuth authorization codes for session tokens.

5. **Landing Page & Login Page Integration**:
   - Connected "Sign Up Free" and "Try Free Now" in `LandingNavbar.tsx` to open the modal.
   - Connected "Start Practicing Free" in `LandingHero.tsx` to open the modal.
   - Connected "Sign up" button on `/login` to open the modal.
   - Extended `src/app/login/actions.ts` to persist `first_name` and `last_name` into Supabase user metadata.

#### Visibility & Stacking Context Fix
- **Problem**: When clicking "Sign Up", the popup was not visible because the modal was being rendered inside parent DOM containers (including within a `<form>` on `/login` and within a restricted width container on `/dashboard`), causing stacking context clipping and invalid DOM nesting.
- **Fix**: Upgraded `RegisterModal.tsx` to use React's `createPortal(modalContent, document.body)` with client mount hydration guard, `z-index: 99999`, robust viewport fixed positioning, body scroll lock while open, and `e.stopPropagation()` on the modal dialog card to prevent accidental dismissal.

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
│   │   ├── page.tsx                      ← Landing Page (Navbar, Hero, Features, How It Works, Topics, Footer)
│   │   ├── layout.tsx                    ← Root layout with ThinkTalk metadata
│   │   ├── login/
│   │   │   ├── page.tsx                  ← Login/Signup UI
│   │   │   └── actions.ts                ← login(), signup(), signout()
│   │   ├── dashboard/
│   │   │   └── page.tsx                  ← Student dashboard with real stats
│   │   ├── practice/
│   │   │   └── page.tsx                  ← Random exercise + SpeechPractice
│   │   ├── api/
│   │   │   ├── assemblyai-token/
│   │   │   │   └── route.ts             ← GET: issues short-lived AssemblyAI v3 tokens
│   │   │   └── evaluate/
│   │   │       └── route.ts             ← POST: Gemini AI evaluation with multi-model cascade
│   │   ├── auth/
│   │   │   └── callback/
│   │   │       └── route.ts             ← GET: OAuth callback handler
│   │   └── actions/
│   │       └── save-attempt.ts           ← Server Action: saves to Supabase
│   ├── components/
│   │   ├── RegisterModal.tsx             ← Wireframe "Register Account" popup modal
│   │   ├── RegisterModalTrigger.tsx      ← Reusable button trigger for RegisterModal
│   │   ├── DashboardHeader.tsx           ← Interactive dashboard header with "Sign Up" popup
│   │   ├── LandingNavbar.tsx             ← Sticky navbar with auth-aware CTAs & mobile drawer
│   │   ├── LandingHero.tsx               ← Hero section with smartphone mockup & floating badges
│   │   ├── LandingFeatures.tsx           ← 6 core capability feature cards
│   │   ├── LandingHowItWorks.tsx         ← 3-step student practice guide & CTA banner
│   │   ├── LandingTopics.tsx             ← Interactive Grade 7 prompt showcase with sample scores
│   │   ├── LandingFooter.tsx             ← Brand footer with navigation and tech attribution
│   │   ├── SpeechPractice.tsx            ← Main recording + evaluation flow (AssemblyAI WebSocket)
│   │   ├── MicrophoneButton.tsx          ← Mic button (idle state)
│   │   └── RecordingControls.tsx         ← Cancel | Recording... | Save
│   ├── lib/
│   │   ├── speech.ts                     ← Empty placeholder (STT handled in SpeechPractice)
│   │   ├── ai-evaluation.ts              ← Calls POST /api/evaluate (Gemini)
│   │   └── supabase.ts                   ← Basic Supabase client (browser)
│   ├── types/
│   │   ├── student.ts                    ← RecordingState type
│   │   ├── exercise.ts                   ← Exercise interface
│   │   └── evaluation.ts                 ← EvaluationResult interface
│   └── utils/
│       └── supabase/
│           ├── server.ts                 ← SSR server client (cookies)
│           └── client.ts                 ← SSR browser client
└── .env.local                            ← Your API keys (keep secret!)
```

---

## Environment Variables Required

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
ASSEMBLYAI_API_KEY=your_assemblyai_api_key
GEMINI_API_KEY=your_gemini_api_key
```

> ⚠️ NEVER commit `.env.local` to GitHub. It is already in `.gitignore`.

### Getting API Keys
- **Supabase**: [supabase.com/dashboard](https://supabase.com/dashboard/projects) → Project Settings → API
- **AssemblyAI**: [assemblyai.com/dashboard](https://www.assemblyai.com/dashboard) → API Keys
- **Gemini**: [aistudio.google.com/apikey](https://aistudio.google.com/apikey) (free tier)

---

## Key Bug Fixes

### `ai-evaluation.ts` Fix (Stage 3)
- **Problem:** `import puter from "@heyputer/puter.js"` caused a TypeScript error because Puter.js is a **browser global**, not an ES module.
- **Fix:** Replaced with `declare const puter: any` and removed the import entirely.
- **Also fixed:** Nested backtick template literals that caused a syntax parse error. Prompt rebuilt as a `string[]` joined with `\n`.

### AssemblyAI Temporary Token 404 Fix (Stage 8)
- **Problem:** Clicking the microphone showed "Failed to create token". Calling `https://api.assemblyai.com/v2/realtime/token` returned a `404 Not Found` because AssemblyAI deprecated the legacy v2 temporary token endpoint.
- **Fix:** Switched to AssemblyAI Streaming v3:
  - Token endpoint: `GET https://streaming.assemblyai.com/v3/token?expires_in_seconds=480`
  - WebSocket URL: `wss://streaming.assemblyai.com/v3/ws?sample_rate=16000&token=${token}`
  - Updated event handler to support v3 `Turn` events (`transcript`, `end_of_turn`), preserving any active partial transcript on save.

### Gemini 404 Evaluation Model Fix (Stage 8)
- **Problem:** Clicking Save triggered `"We couldn't evaluate your answer right now. Your transcript has been preserved. Please try again later."` Calling `gemini-2.0-flash` returned `404 Not Found` because Google retired that model name for new requests.
- **Fix:** Updated `src/app/api/evaluate/route.ts` to use `gemini-flash-latest` (with automatic fallback to `gemini-flash-lite-latest`) and configured `responseMimeType: "application/json"` for guaranteed valid structured evaluation JSON.

### Vercel / GitHub "fetch failed" Fix (Stage 8)
- **Problem:** When uploaded to GitHub and deployed to Vercel, pages or API routes threw `fetch failed` (500 error).
- **Cause:**
  1. `.env.local` is intentionally in `.gitignore` and is NOT committed to GitHub. On Vercel, all environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ASSEMBLYAI_API_KEY`, `GEMINI_API_KEY`) were missing by default.
  2. `src/proxy.ts` (Next.js middleware) ran on every request and attempted `supabase.auth.getUser()` with `undefined` Supabase URL, causing Node.js native `fetch` to throw an unhandled `TypeError: fetch failed`.
- **Fix:**
  1. Made `src/proxy.ts` defensive: skips auth refresh if env vars are missing and catches errors gracefully.
  2. Made `src/utils/supabase/server.ts` and `client.ts` validate env vars with clear descriptive error messages and sanitize quotes/trailing slashes.
  3. Added try/catch guards to Server Actions (`login`, `signup`, `saveAttemptToDatabase`) and protected routes (`/dashboard`, `/practice`).
  4. Added `.env.example` to the repository.
  5. Documented the required Vercel Environment Variables setup.

### Intermittent Gemini 503 Spike & Evaluation Resilience Fix (Stage 8)
- **Problem:** Students occasionally saw *"We couldn't evaluate your answer right now. Your transcript has been preserved. Please try again later."* after clicking Save.
- **Root Cause:**
  1. Google's free-tier `gemini-flash-latest` model intermittently experiences high-demand spikes (`503 Service Unavailable`).
  2. If the request failed, `evaluateResponse()` swallowed the specific server error and threw a generic failure message.
  3. The student's recorded transcript was reset to idle without an in-place retry option, forcing the user to speak again.
- **Fix:**
  1. **Multi-Model Cascade with Strict Schema:** Updated `POST /api/evaluate` to try `gemini-flash-lite-latest` first (ultrafast ~1s response, highly available), cascading to `gemini-flash-latest` and `gemini-3.5-flash` with brief backoff.
  2. **Strict Schema & Safety Settings:** Configured `responseSchema` via `SchemaType.OBJECT` to guarantee all 6 evaluation fields are returned, plus adjusted safety thresholds to avoid false-positive blocks on student answers.
  3. **Preserved Transcript & In-Place Retry:** Preserved the student's transcript in state and added a `"🔄 Retry Evaluation"` button in `SpeechPractice.tsx` so students can re-trigger evaluation with a single click without having to re-record their speech.

---

## Vercel Deployment Checklist

When deploying to Vercel, you **must** add your environment variables in Vercel:

1. Open your project dashboard at [vercel.com](https://vercel.com).
2. Go to **Settings** → **Environment Variables**.
3. Add the following 5 variables (copy values from your local `.env.local`):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ASSEMBLYAI_API_KEY`
   - `GEMINI_API_KEY`
4. Apply them to **Production**, **Preview**, and **Development**.
5. Go to **Deployments** → click the three dots on your latest deployment → **Redeploy**.

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

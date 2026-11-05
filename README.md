# FaceCard — AI-Powered Video Business Cards

![FaceCard homepage](public/images/homepage.png)

FaceCard lets professionals create a 15–30 second video introduction in minutes. An AI-written script, browser-based recording, and an instantly shareable link — no equipment, no editing, no friction.

---

## Tech Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 14 (App Router) with TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| AI | Anthropic Claude (`claude-opus-4-8`) via `@anthropic-ai/sdk` |
| Video recording | Loom Record SDK + oEmbed |
| Auth | NextAuth.js with Google and LinkedIn OAuth |
| Fonts | Fraunces (display) + DM Sans (body) via `next/font` |

---

## Key Features

- **AI script generation** — Claude writes a personalized script from the user's profile, skills, and goals. System prompt enforces spoken-word-only output; no stage directions or scene markers survive into the final script.
- **Browser-based recording** — Loom SDK handles camera capture with the script visible on screen. No installs, no uploads.
- **Multi-step form with localStorage persistence** — profile data is stored client-side across the 5-step flow so progress survives navigation and page refreshes.
- **Context-aware homepage CTA** — returning authenticated users see a "Pick up where you left off" card that reads localStorage and routes them to the correct step rather than back to the beginning.
- **Branded auth error handling** — custom NextAuth error page with clear copy for `OAuthAccountNotLinked` and other provider errors.
- **Design system** — custom CSS variable palette (warm cream / ink / deep teal) applied via shadcn's variable cascade, so all components re-theme from a single `globals.css` change.

---

## Project Structure

```text
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/   # NextAuth route with Google + LinkedIn
│   │   ├── generate-script/      # Claude API route for script generation
│   │   └── upload-avatar/        # Avatar upload handler
│   ├── auth/error/               # Custom branded auth error page
│   ├── create-profile/           # 5-step onboarding flow
│   │   ├── page.tsx              # Step 1: Profile info
│   │   ├── interests/            # Step 2: Skills & interests
│   │   ├── script/               # Step 3: AI script generation + editing
│   │   ├── video/                # Step 4: Loom recording
│   │   └── share/                # Step 5: Shareable link + QR + embed
│   ├── features/                 # Marketing features page
│   └── pricing/                  # Free + Pro pricing page
├── components/
│   ├── resume-card.tsx           # Context-aware returning-user CTA
│   ├── header.tsx
│   ├── footer.tsx
│   └── ui/                       # shadcn/ui components
└── lib/
    ├── form-utils.ts             # localStorage persistence helpers
    ├── openai-enhanced.ts        # Script versioning + history
    └── script-generator.ts       # Fallback script generation
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Google OAuth credentials
- LinkedIn OAuth credentials
- Anthropic API key
- Loom Public App ID (sandbox for dev, production for prod)

### Installation

```bash
git clone https://github.com/dfrho/facecard.git
cd facecard
npm install
```

### Environment Variables

Create `.env.local` in the project root:

```env
# Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# LinkedIn OAuth
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret

# Anthropic
CLAUDE_API_KEY=your-anthropic-api-key

# Loom
NEXT_PUBLIC_LOOM_SANDBOX_PUBLIC_APP_ID=your-sandbox-app-id
NEXT_PUBLIC_LOOM_PUBLIC_APP_ID=your-production-app-id
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Testing

| Command | What it runs |
| --- | --- |
| `npm test` | Vitest unit tests for `src/lib` and the script API (`src/**/*.test.ts`) |
| `npm run test:watch` | The unit tests in watch mode |
| `npm run test:e2e` | Playwright end-to-end tests (`e2e/app`) against a local server on port 3100 |
| `npm run test:live` | Sign-in checks against the deployed site (`e2e/live`); set `LIVE_URL` to check another deployment |

Before the first end-to-end run, install the browser:

```bash
npx playwright install chromium
```

The end-to-end tests start their own server with fake OAuth credentials and Claude switched off, so they never use the keys in `.env.local`. Signed-in tests use a test session cookie instead of a real Google or LinkedIn login.

GitHub Actions runs lint, unit tests and end-to-end tests on every push to `main` and every pull request (`.github/workflows/ci.yml`). The live sign-in check (`.github/workflows/live-check.yml`) runs after each successful Vercel production deploy, or by hand from the Actions tab.

---

## Rate Limiting (Vercel Firewall)

Every script generation is a paid Claude call, so `/api/generate-script` is limited in two places:

- **In the app:** signed-in users only, at most 20 generations per user per hour (`src/app/api/generate-script/route.ts`). This count is kept per server instance, so it's not a strict global limit.
- **At Vercel's edge:** a Firewall rule configured in the Vercel project (not in this repository):

| Setting | Value |
| --- | --- |
| Name | `Rate limit script generation` |
| Rule ID | `rule_rate_limit_script_generation_3M3CNo` |
| Matches | `POST` requests where the path equals `/api/generate-script` |
| Limit | 60 requests per IP address per hour (fixed window, counted per Vercel region) |
| When exceeded | `429 Too Many Requests`, returned before the function runs (blocked requests aren't billed) |

Traffic for the rule: https://vercel.com/david-rhodes-projects/facecard/firewall/traffic?filter=rule_rate_limit_script_generation_3M3CNo

### Managing the rule

The commands below use the latest Vercel CLI through `npx`. Link the folder to the project once first (this creates a git-ignored `.vercel/` folder):

```bash
npx vercel@latest link --scope david-rhodes-projects --project facecard
```

Show the live rule:

```bash
npx vercel@latest firewall rules list --expand
```

Changes are staged as drafts and only take effect when published. `publish` shows what will change and asks you to confirm; to approve without the prompt, add `--confirm-name facecard`.

**Undo (turn the rule off but keep it):**

```bash
npx vercel@latest firewall rules disable "Rate limit script generation"
```

```bash
npx vercel@latest firewall publish
```

**Turn it back on:**

```bash
npx vercel@latest firewall rules enable "Rate limit script generation"
```

```bash
npx vercel@latest firewall publish
```

**Remove it completely:**

```bash
npx vercel@latest firewall rules remove "Rate limit script generation" --yes
```

```bash
npx vercel@latest firewall publish
```

**Re-create it** (for example after removing it, or in a new Vercel project):

```bash
npx vercel@latest firewall rules add "Rate limit script generation" \
  --condition '{"type":"path","op":"eq","value":"/api/generate-script"}' \
  --condition '{"type":"method","op":"eq","value":"POST"}' \
  --action rate_limit \
  --rate-limit-window 3600 \
  --rate-limit-requests 60 \
  --rate-limit-keys ip \
  --rate-limit-action rate_limit \
  --yes
```

```bash
npx vercel@latest firewall publish
```

To see staged changes before publishing, run `npx vercel@latest firewall diff`; to throw them away, `npx vercel@latest firewall discard --yes`. A re-created rule gets a new rule ID, so update the table and traffic link above.

---

## Pricing

| Plan | Price | Cards | Script generations | Recordings |
| --- | --- | --- | --- | --- |
| Free | $0 | 1 | Up to 3 | 1 |
| Pro | $45/mo | 5 | Unlimited | Unlimited |

---

## Roadmap

- [ ] Supabase integration for persistent user data and avatar storage
- [ ] Dashboard for managing multiple cards
- [ ] Stripe integration for Pro billing
- [ ] Custom slug support (`facecard.ai/v/yourname`)
- [ ] Analytics (view counts, link clicks)

# Offer Lens

Read the fine print before you sign.

[![Ko-fi](https://img.shields.io/badge/Ko--fi-FF5E5B?style=flat&logo=ko-fi&logoColor=white)](https://ko-fi.com/gerardolucero)
[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-FFDD00?style=flat&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/lucerorios0)
[![GitHub Stars](https://img.shields.io/github/stars/GerardoLucero/offer-lens?style=social)](https://github.com/GerardoLucero/offer-lens)

Offer Lens analyzes job offers and employment contracts with the eye of a senior employment lawyer. Paste the offer text and get a structured report in seconds: red flags with their severity, specific clauses to negotiate, a market salary assessment, and the exact questions to ask the employer before you commit.

---

## What you get

**Overall score (0-100)** — a calibrated assessment of how candidate-friendly this offer is.

**Red flags** — each one rated by severity (high / medium / low), with the specific clause, why it is concerning, and the exact question to ask the employer to address it.

**Green flags** — the genuinely positive terms found in the offer.

**Salary assessment** — extracted compensation compared against market ranges for the role and location, with an honest assessment of whether it is below, at, or above market.

**Questions to ask** — 5-7 specific questions you should ask the recruiter or hiring manager before signing.

**Recommendation** — one of four outcomes: accept, negotiate, decline, or investigate further.

**Verdict** — a 2-3 sentence honest summary.

---

## Common red flags it detects

- Overly broad non-compete clauses — scope, geography, and duration
- IP assignment language that could cover side projects or open-source work
- Discretionary bonuses with no guaranteed floor
- Missing severance terms or at-will employment with no protections
- Cliff and vesting terms that favor the employer disproportionately
- Restrictive covenants that survive termination
- Unusual confidentiality obligations that extend beyond the role
- Equity terms missing key protections (acceleration, repurchase rights)

---

## How it works

A single `claude-sonnet-4.6` call reads the offer with the role of an experienced employment lawyer. It looks for specific clause patterns, compares compensation against its training-time market knowledge, and produces a structured JSON output that maps directly to the UI.

Optional: provide personal context (your experience level, location, or specific concerns) to get more targeted analysis.

---

## Stack

- Next.js 15 (App Router)
- Anthropic AI SDK (`@ai-sdk/anthropic`)
- Prisma with SQLite (local) or PostgreSQL (production)
- TypeScript

---

## Getting started

### Prerequisites

- Node.js 20+
- Anthropic API key — get one at [console.anthropic.com](https://console.anthropic.com)

### Install

```bash
git clone https://github.com/GerardoLucero/offer-lens.git
cd offer-lens
npm install
```

### Configure

```bash
cp .env.example .env
```

Edit `.env`:

```
ANTHROPIC_API_KEY=sk-ant-...
DATABASE_URL="file:./dev.db"
```

### Set up the database

```bash
npm run db:generate
npm run db:push
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## API

### POST /api/analyze

Analyze a job offer.

**Request body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `offerText` | string | yes | The full offer or contract text |
| `context` | string | no | Your background, location, concerns (improves accuracy) |

**Response:**

```json
{
  "id": "offer-1234567890",
  "result": {
    "role": "Senior Software Engineer",
    "company": "Acme Corp",
    "overallScore": 68,
    "redFlags": [
      {
        "severity": "high",
        "clause": "Non-compete clause — 2 years, global scope",
        "reason": "Overbroad in scope and duration. Unlikely to be enforceable in many jurisdictions but creates uncertainty.",
        "whatToAsk": "Can we narrow the non-compete to direct competitors in our specific market, and reduce the duration to 6 months?"
      }
    ],
    "greenFlags": ["Above-market base salary", "4-week vesting cliff instead of 1 year"],
    "salaryAssessment": {
      "offered": "$180,000 base + 0.1% equity",
      "marketRange": "$160,000-$200,000 for Senior SWE in SF",
      "assessment": "at_market",
      "notes": "Base is solid. Equity percentage is low for Series B."
    },
    "questionsToAsk": ["..."],
    "verdict": "...",
    "recommendation": "negotiate"
  }
}
```

---

## Important note

Offer Lens is a research and analysis tool, not legal advice. For significant employment decisions — especially those involving equity, international employment, or restrictive covenants — consult a licensed employment attorney in your jurisdiction.

---

## Deployment

### Vercel

```bash
vercel deploy
```

Set `ANTHROPIC_API_KEY` and `DATABASE_URL` in your Vercel project settings.

### Self-hosted

Railway, Render, Fly.io, or any Node.js host. Requires `ANTHROPIC_API_KEY` and a `DATABASE_URL`.

---

## License

MIT

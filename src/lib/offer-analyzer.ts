import { anthropic } from '@ai-sdk/anthropic'
import { generateText } from 'ai'

export interface OfferAnalysis {
  role: string
  company: string
  overallScore: number  // 0-100
  redFlags: RedFlag[]
  greenFlags: string[]
  salaryAssessment: SalaryAssessment
  questionsToAsk: string[]
  verdict: string
  recommendation: 'accept' | 'negotiate' | 'decline' | 'investigate'
}

export interface RedFlag {
  severity: 'high' | 'medium' | 'low'
  clause: string
  reason: string
  whatToAsk: string
}

export interface SalaryAssessment {
  offered: string
  marketRange: string
  assessment: 'below_market' | 'at_market' | 'above_market' | 'unknown'
  notes: string
}

export async function analyzeOffer(offerText: string, context?: string): Promise<OfferAnalysis> {
  const { text } = await generateText({
    model: anthropic('claude-sonnet-4.6'),
    system: `You are a senior employment lawyer and career advisor who has reviewed thousands of job offers.
You help candidates understand what they are signing before they accept.
Be direct. Name specific clauses. Do not be vague.
Return only valid JSON, no markdown.`,
    prompt: `Analyze this job offer carefully.

JOB OFFER:
${offerText}

${context ? `CANDIDATE CONTEXT:\n${context}\n` : ''}

Look for:
- Non-compete clauses and their scope/duration
- IP assignment that could cover personal projects
- At-will vs. contract employment implications
- Equity terms (cliff, vesting, acceleration, strike price)
- Bonus structure and conditions (discretionary vs. guaranteed)
- Severance terms or lack thereof
- Unusual restrictive covenants
- Missing standard protections

Return JSON only:
{
  "role": "extracted job title",
  "company": "extracted company name",
  "overallScore": 75,
  "redFlags": [
    {
      "severity": "high | medium | low",
      "clause": "quote or describe the specific clause",
      "reason": "why this is concerning",
      "whatToAsk": "exact question to ask the employer"
    }
  ],
  "greenFlags": ["positive things found in the offer"],
  "salaryAssessment": {
    "offered": "extracted compensation",
    "marketRange": "estimated market range for this role/location based on your knowledge",
    "assessment": "below_market | at_market | above_market | unknown",
    "notes": "context about the salary"
  },
  "questionsToAsk": ["5-7 specific questions to ask before signing"],
  "verdict": "2-3 sentence honest assessment",
  "recommendation": "accept | negotiate | decline | investigate"
}`,
    maxOutputTokens: 1500,
  })

  try {
    return JSON.parse(text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()) as OfferAnalysis
  } catch {
    return {
      role: 'Unknown Role', company: 'Unknown Company', overallScore: 50,
      redFlags: [{ severity: 'medium', clause: 'Unable to parse offer', reason: 'The offer text could not be fully analyzed', whatToAsk: 'Please review the offer with a lawyer' }],
      greenFlags: [],
      salaryAssessment: { offered: 'Unknown', marketRange: 'Unknown', assessment: 'unknown', notes: 'Could not extract salary information' },
      questionsToAsk: ['Please consult with a legal professional to review this offer'],
      verdict: 'Analysis incomplete. Please ensure the full offer text is provided.',
      recommendation: 'investigate',
    }
  }
}

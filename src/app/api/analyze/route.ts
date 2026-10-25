import { NextResponse } from 'next/server'
import { analyzeOffer } from '@/lib/offer-analyzer'

export const maxDuration = 60

const MAX_OFFER_CHARS = 20_000
const MAX_CONTEXT_CHARS = 1_000

export async function POST(request: Request) {
  let body: { offerText?: unknown; context?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Body must be valid JSON.' }, { status: 400 })
  }

  const offerText = typeof body.offerText === 'string' ? body.offerText.trim() : ''
  const context = typeof body.context === 'string' ? body.context.trim() : ''
  if (!offerText) return NextResponse.json({ error: 'offerText is required.' }, { status: 400 })
  if (offerText.length > MAX_OFFER_CHARS || context.length > MAX_CONTEXT_CHARS) {
    return NextResponse.json(
      { error: `offerText admits up to ${MAX_OFFER_CHARS} characters and context up to ${MAX_CONTEXT_CHARS}.` },
      { status: 413 }
    )
  }

  try {
    const analysis = await analyzeOffer(offerText, context || undefined)
    return NextResponse.json({ analysis })
  } catch (err) {
    console.error('[analyze]', err instanceof Error ? err.message.slice(0, 200) : 'unknown error')
    return NextResponse.json({ error: 'The analysis could not be completed. Try again.' }, { status: 500 })
  }
}

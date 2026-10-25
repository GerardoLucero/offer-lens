'use client'

import { useState } from 'react'
import type { OfferAnalysis } from '@/lib/offer-analyzer'

export default function Home() {
  const [offerText, setOfferText] = useState('')
  const [context, setContext] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<OfferAnalysis | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setAnalysis(null)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offerText, context }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Unexpected error')
      setAnalysis(json.analysis)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main>
      <h1>Offer Lens</h1>
      <p>Paste a job offer or employment contract and get a clause-by-clause review.</p>
      <form onSubmit={submit}>
        <label htmlFor="offer">Offer or contract text</label>
        <textarea id="offer" value={offerText} onChange={(e) => setOfferText(e.target.value)} rows={12} style={{ width: '100%' }} required />
        <label htmlFor="ctx">Context (optional)</label>
        <input id="ctx" value={context} onChange={(e) => setContext(e.target.value)} style={{ width: '100%' }} />
        <button type="submit" disabled={loading || !offerText.trim()}>
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </form>
      {error && <p role="alert">{error}</p>}
      {analysis && (
        <section aria-live="polite">
          <h2>
            {analysis.role} at {analysis.company}: {analysis.overallScore}/100 ({analysis.recommendation})
          </h2>
          <p>{analysis.verdict}</p>
          <h3>Red flags</h3>
          <ul>
            {analysis.redFlags.map((f, i) => (
              <li key={i}>
                <strong>[{f.severity}]</strong> {f.clause}: {f.reason} Ask: {f.whatToAsk}
              </li>
            ))}
          </ul>
          <h3>Questions to ask</h3>
          <ul>
            {analysis.questionsToAsk.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}

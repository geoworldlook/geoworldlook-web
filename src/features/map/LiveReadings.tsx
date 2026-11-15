"use client"

import { useEffect, useState } from 'react'

type Reading = {
  id: string
  title: string
  description: string
  status: string
  reading: number | null
  unit: string
  date: string
}

const STATUS_COLOR: Record<string, string> = {
  better: '#34d399',
  confirmed: '#34d399',
  stable: '#34d399',
  similar: '#9ca3af',
  partly: '#fbbf24',
  worse: '#f87171',
  'not confirmed': '#f87171',
  unstable: '#f87171',
  insufficient: '#4b5563',
}

/**
 * Latest readings from the stations of one live source (the same GeoJSON the map shows).
 * Read in the browser on every visit, so the list is always current.
 */
export default function LiveReadings({ url, sort = 'title' }: { url: string; sort?: 'reading' | 'title' }) {
  const [rows, setRows] = useState<Reading[] | null>(null)
  const [updated, setUpdated] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch(url, { cache: 'no-store' })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        return response.json()
      })
      .then((data) => {
        if (cancelled) return
        const list: Reading[] = (data.features ?? []).map((feature: { properties?: Record<string, unknown> }) => {
          const p = feature.properties ?? {}
          return {
            id: String(p.id ?? p.title ?? ''),
            title: String(p.title ?? '').replace(/^.*?·\s*/, ''),
            description: String(p.description ?? ''),
            status: String(p.status ?? ''),
            reading: typeof p.reading === 'number' ? p.reading : null,
            unit: String(p.reading_unit ?? ''),
            date: String(p.reading_date ?? ''),
          }
        })
        list.sort((a, b) =>
          sort === 'reading' ? (b.reading ?? -1) - (a.reading ?? -1) : a.title.localeCompare(b.title),
        )
        setRows(list)
        const first = (data.features ?? [])[0]?.properties?.updated
        setUpdated(typeof first === 'string' ? first : '')
      })
      .catch((e) => { if (!cancelled) setError(e instanceof Error ? e.message : String(e)) })
    return () => { cancelled = true }
  }, [url, sort])

  if (error) return <p className="text-xs text-red-400">Readings could not be loaded ({error})</p>
  if (!rows) return <p className="text-xs text-gray-500">Loading the latest readings…</p>

  return (
    <div>
      <p className="text-gray-500 text-xs mb-2">
        {rows.length} stations{updated ? ` · last automatic run ${updated}` : ''}
      </p>
      <ul className="max-h-56 overflow-y-auto divide-y divide-white/[0.06] border border-white/[0.06] rounded-lg">
        {rows.map((row) => (
          <li key={row.id} className="flex items-center justify-between gap-3 px-3 py-2" title={row.description}>
            <span className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: STATUS_COLOR[row.status] ?? '#4b5563' }} />
              <span className="text-gray-300 text-sm truncate">{row.title}</span>
            </span>
            <span className="text-right shrink-0">
              <span className="text-white text-sm font-medium">{row.reading !== null ? row.reading : '–'}</span>
              <span className="text-gray-500 text-xs"> {row.unit}</span>
              {row.date && <span className="block text-gray-600 text-[11px]">{row.date}</span>}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

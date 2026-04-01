// src/sections/BatchPanel.jsx
import { useState } from 'react'

export default function BatchPanel() {
  const [urls, setUrls] = useState(['', '', ''])
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState([])
  const [error, setError] = useState(null)

  const updateUrl = (i, val) => {
    const next = [...urls]
    next[i] = val
    setUrls(next)
  }

  const runBatch = async () => {
    const validUrls = urls.filter(u => u.trim())
    if (!validUrls.length) return
    setLoading(true)
    setError(null)
    setResults([])
    try {
      const res = await fetch('/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls: validUrls })
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setResults(data.results)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 style={{ fontSize: 16, fontWeight: 500, marginBottom: 4 }}>
        Batch analysis
      </h2>
      <p style={{ fontSize: 13, color: '#777', marginBottom: 16 }}>
        Sends all URLs in one gRPC call via AnalyzeBatch RPC
      </p>

      {/* URL inputs */}
      <div style={{ background: '#fff', border: '0.5px solid #e5e5e0',
        borderRadius: 12, padding: 16, marginBottom: 16 }}>
        {urls.map((url, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%',
              background: '#f4f4f0', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 11, color: '#888', flexShrink: 0 }}>
              {i + 1}
            </div>
            <input
              value={url}
              onChange={e => updateUrl(i, e.target.value)}
              placeholder={`https://youtube.com/shorts/url${i + 1}`}
              style={{ flex: 1, height: 32, border: '0.5px solid #ccc',
                borderRadius: 8, padding: '0 10px', fontSize: 12 }}
            />
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginTop: 8 }}>
          <span style={{ fontSize: 11, color: '#aaa' }}>
            {urls.filter(u => u.trim()).length} URLs · single gRPC call
          </span>
          <button
            onClick={runBatch}
            disabled={loading || !urls.some(u => u.trim())}
            style={{ height: 34, padding: '0 16px', background: '#534AB7',
              color: '#fff', border: 'none', borderRadius: 8, fontSize: 13,
              cursor: 'pointer', opacity: loading ? 0.6 : 1 }}
          >
            {loading ? 'Processing...' : 'Run batch'}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: '#FCEBEB', border: '0.5px solid #F09595',
          borderRadius: 8, padding: 12, fontSize: 13, color: '#791F1F', marginBottom: 16 }}>
          {error}
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div style={{ background: '#fff', border: '0.5px solid #e5e5e0',
          borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 12 }}>
            Batch results — {results.length} processed
          </div>
          {results.map((r, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start',
              padding: '10px 0', borderBottom: i < results.length - 1 ? '0.5px solid #e5e5e0' : 'none' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', marginTop: 4, flexShrink: 0,
                background: r.error ? '#E24B4A' : '#1D9E75' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: '#111',
                  marginBottom: 4, wordBreak: 'break-all' }}>
                  {r.url.replace('https://www.youtube.com/shorts/', 'shorts/')}
                </div>
                {r.error ? (
                  <div style={{ fontSize: 12, color: '#E24B4A' }}>{r.error}</div>
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                    {r.tags.slice(0, 4).map(tag => (
                      <span key={tag} style={{ background: '#EEEDFE', color: '#3C3489',
                        fontSize: 11, padding: '1px 7px', borderRadius: 20 }}>
                        {tag}
                      </span>
                    ))}
                    <span style={{ fontSize: 11, color: '#aaa', padding: '1px 4px' }}>
                      {r.category}
                    </span>
                  </div>
                )}
              </div>
              <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 3,
                background: '#f4f4f0', border: '0.5px solid #e5e5e0', color: '#888',
                fontFamily: 'monospace', flexShrink: 0 }}>
                {r.error ? 'ERR' : 'OK'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
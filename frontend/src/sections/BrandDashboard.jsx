// src/sections/BrandDashboard.jsx
import { useState } from 'react'
import { gql } from '@apollo/client'
import { useLazyQuery } from '@apollo/client/react'

// Brand query — notice: no `summary` field requested
const BRAND_QUERY = gql`
  query BrandAnalyze($url: String!) {
    analyzeVideo(url: $url) {
      tags
      category
      brandSafe
      confidence
    }
  }
`

export default function BrandDashboard() {
  const [url, setUrl] = useState('')
  const [analyze, { loading, data, error }] = useLazyQuery(BRAND_QUERY)

  const result = data?.analyzeVideo

  return (
    <div>
      <h2 style={{ fontSize: 16, fontWeight: 500, marginBottom: 4 }}>
        Content moderation review
      </h2>
      <p style={{ fontSize: 13, color: '#777', marginBottom: 16 }}>
        GraphQL query — requesting: tags, category, brandSafe, confidence
      </p>

      {/* Query preview */}
      <pre style={{
        background: '#f4f4f0', border: '0.5px solid #e5e5e0',
        borderRadius: 8, padding: 12, fontSize: 12, color: '#555',
        marginBottom: 16, lineHeight: 1.6
      }}>{`query {
  analyzeVideo(url: "...") {
    tags
    category
    brandSafe
    confidence
  }
}`}</pre>

      {/* Input */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <input
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://youtube.com/shorts/..."
          style={{ flex: 1, height: 36, border: '0.5px solid #ccc',
            borderRadius: 8, padding: '0 12px', fontSize: 13 }}
        />
        <button
          onClick={() => analyze({ variables: { url } })}
          disabled={!url || loading}
          style={{ height: 36, padding: '0 16px', background: '#185FA5',
            color: '#fff', border: 'none', borderRadius: 8, fontSize: 13,
            cursor: 'pointer', opacity: loading ? 0.6 : 1 }}
        >
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: '#FCEBEB', border: '0.5px solid #F09595',
          borderRadius: 8, padding: 12, fontSize: 13, color: '#791F1F', marginBottom: 16 }}>
          {error.message}
        </div>
      )}

      {/* Result */}
      {result && (
        <div style={{ background: '#fff', border: '0.5px solid #e5e5e0',
          borderRadius: 12, padding: 16 }}>

          {/* Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16 }}>
            {[
              { label: 'Confidence', value: result.confidence.toFixed(2) },
              { label: 'Brand safety', value: result.brandSafe ? 'Safe' : 'Unsafe',
                color: result.brandSafe ? '#1D9E75' : '#E24B4A' },
              { label: 'Category', value: result.category },
            ].map(m => (
              <div key={m.label} style={{ background: '#f9f9f8', borderRadius: 8, padding: 10 }}>
                <div style={{ fontSize: 18, fontWeight: 500, color: m.color || '#111' }}>{m.value}</div>
                <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>{m.label}</div>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div style={{ fontSize: 11, color: '#999', marginBottom: 6 }}>Tags</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {result.tags.map(tag => (
              <span key={tag} style={{ background: '#E6F1FB', color: '#0C447C',
                fontSize: 12, padding: '2px 8px', borderRadius: 20 }}>
                {tag}
              </span>
            ))}
          </div>

          <div style={{ marginTop: 12, paddingTop: 12, borderTop: '0.5px solid #e5e5e0',
            fontSize: 11, color: '#aaa' }}>
            summary field not requested — GraphQL only returned what brand needed
          </div>
        </div>
      )}
    </div>
  )
}
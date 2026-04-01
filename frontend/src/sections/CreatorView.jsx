// src/sections/CreatorView.jsx
import { useState } from 'react'
import { gql } from '@apollo/client'
import { useLazyQuery } from '@apollo/client/react'

// Creator query — no brandSafe, no confidence, no category
const CREATOR_QUERY = gql`
  query CreatorAnalyze($url: String!) {
    analyzeVideo(url: $url) {
      tags
      summary
    }
  }
`

export default function CreatorView() {
  const [url, setUrl] = useState('')
  const [analyze, { loading, data, error }] = useLazyQuery(CREATOR_QUERY)

  const result = data?.analyzeVideo

  return (
    <div>
      <h2 style={{ fontSize: 16, fontWeight: 500, marginBottom: 4 }}>
        My video tags
      </h2>
      <p style={{ fontSize: 13, color: '#777', marginBottom: 16 }}>
        GraphQL query — requesting: tags, summary only
      </p>

      <pre style={{
        background: '#f4f4f0', border: '0.5px solid #e5e5e0',
        borderRadius: 8, padding: 12, fontSize: 12, color: '#555',
        marginBottom: 16, lineHeight: 1.6
      }}>{`query {
  analyzeVideo(url: "...") {
    tags
    summary
  }
}`}</pre>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <input
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="Paste your video URL..."
          style={{ flex: 1, height: 36, border: '0.5px solid #ccc',
            borderRadius: 8, padding: '0 12px', fontSize: 13 }}
        />
        <button
          onClick={() => analyze({ variables: { url } })}
          disabled={!url || loading}
          style={{ height: 36, padding: '0 16px', background: '#0F6E56',
            color: '#fff', border: 'none', borderRadius: 8, fontSize: 13,
            cursor: 'pointer', opacity: loading ? 0.6 : 1 }}
        >
          {loading ? 'Analyzing...' : 'Get my tags'}
        </button>
      </div>

      {error && (
        <div style={{ background: '#FCEBEB', border: '0.5px solid #F09595',
          borderRadius: 8, padding: 12, fontSize: 13, color: '#791F1F', marginBottom: 16 }}>
          {error.message}
        </div>
      )}

      {result && (
        <div style={{ background: '#fff', border: '0.5px solid #e5e5e0',
          borderRadius: 12, padding: 16 }}>

          <div style={{ fontSize: 11, color: '#999', marginBottom: 6 }}>
            Tags for your video
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 16 }}>
            {result.tags.map(tag => (
              <span key={tag} style={{ background: '#E1F5EE', color: '#085041',
                fontSize: 12, padding: '2px 8px', borderRadius: 20 }}>
                {tag}
              </span>
            ))}
          </div>

          <div style={{ fontSize: 11, color: '#999', marginBottom: 6 }}>Summary</div>
          <div style={{ fontSize: 13, color: '#333', lineHeight: 1.6 }}>{result.summary}</div>

          <div style={{ marginTop: 12, paddingTop: 12, borderTop: '0.5px solid #e5e5e0',
            fontSize: 11, color: '#aaa' }}>
            brandSafe and confidence not shown — creator doesn't need them
          </div>
        </div>
      )}
    </div>
  )
}
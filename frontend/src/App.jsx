// src/App.jsx
import { useState } from 'react'
import BrandDashboard from './sections/BrandDashboard'
import CreatorView from './sections/CreatorView'
import BatchPanel from './sections/BatchPanel'

const TABS = [
  { id: 'brand',   label: 'Brand dashboard' },
  { id: 'creator', label: 'Creator view' },
  { id: 'batch',   label: 'Batch / gRPC' },
]

export default function App() {
  const [active, setActive] = useState('brand')

  return (
    <div style={{ minHeight: '100vh', background: '#f9f9f8' }}>
      {/* Nav */}
      <nav style={{
        background: '#fff', borderBottom: '0.5px solid #e5e5e0',
        display: 'flex', alignItems: 'center', padding: '0 24px', height: 48
      }}>
        <span style={{ fontWeight: 500, fontSize: 15, marginRight: 24 }}>VidTag</span>
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActive(tab.id)} style={{
            height: 48, padding: '0 16px', border: 'none', background: 'none',
            cursor: 'pointer', fontSize: 13, fontWeight: active === tab.id ? 500 : 400,
            color: active === tab.id ? '#111' : '#777',
            borderBottom: active === tab.id ? '2px solid #378ADD' : '2px solid transparent'
          }}>
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <main style={{ padding: 24, maxWidth: 720, margin: '0 auto' }}>
        {active === 'brand'   && <BrandDashboard />}
        {active === 'creator' && <CreatorView />}
        {active === 'batch'   && <BatchPanel />}
      </main>
    </div>
  )
}
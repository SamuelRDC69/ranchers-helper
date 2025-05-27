// STEP 1: Most basic React app - test this first
import { useState } from 'react'

function App() {
  const [message, setMessage] = useState('Loading...')

  // Test basic functionality
  const handleClick = () => {
    setMessage('✅ React is working perfectly!')
  }

  return (
    <div style={{ 
      padding: '2rem', 
      textAlign: 'center',
      minHeight: '100vh',
      background: '#f0f9ff',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h1 style={{ color: '#1e40af' }}>🚜 Ranchers ROI - Step 1</h1>
      <p style={{ fontSize: '1.2rem', margin: '2rem 0' }}>{message}</p>
      <button 
        onClick={handleClick}
        style={{
          background: '#3b82f6',
          color: 'white',
          padding: '1rem 2rem',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1rem',
          cursor: 'pointer'
        }}
      >
        Test React
      </button>
      
      <div style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#64748b' }}>
        <p>If you see this and the button works, React is fine.</p>
        <p>Next: Try Step 2 (API testing)</p>
      </div>
    </div>
  )
}

export default App

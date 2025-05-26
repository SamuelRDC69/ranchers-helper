import { useState } from 'react'

// Minimal test version - if this works, your React setup is fine
function App() {
  const [count, setCount] = useState(0)
  const [testResult, setTestResult] = useState('')

  const testAPI = async () => {
    try {
      setTestResult('Testing...')
      const response = await fetch('https://alcor.exchange/api/v2/tokens/farm-ranchersbank')
      if (response.ok) {
        const data = await response.json()
        setTestResult(`✅ API works! FARM price: $${data.usd_price || 'N/A'}`)
      } else {
        setTestResult(`❌ API failed: ${response.status}`)
      }
    } catch (error) {
      setTestResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  return (
    <div style={{ 
      padding: '2rem', 
      textAlign: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0fdf4 0%, #fefce8 100%)',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        padding: '2rem',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <h1 style={{ color: '#111827', marginBottom: '1rem' }}>
          🚜 Ranchers ROI Premium - Test Version
        </h1>
        
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
            If you see this page, React is working correctly!
          </p>
          
          <p style={{ color: '#374151', fontSize: '1.2rem', marginBottom: '1rem' }}>
            Test Counter: <strong>{count}</strong>
          </p>
          
          <button 
            onClick={() => setCount(count + 1)}
            style={{
              background: 'linear-gradient(to right, #16a34a, #eab308)',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              marginRight: '1rem'
            }}
          >
            Click Me (+1)
          </button>
          
          <button 
            onClick={testAPI}
            style={{
              background: '#2563eb',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600'
            }}
          >
            Test API
          </button>
        </div>

        {testResult && (
          <div style={{
            background: testResult.includes('✅') ? '#f0fdf4' : '#fef2f2',
            border: `1px solid ${testResult.includes('✅') ? '#bbf7d0' : '#fecaca'}`,
            color: testResult.includes('✅') ? '#166534' : '#b91c1c',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '2rem'
          }}>
            {testResult}
          </div>
        )}

        <div style={{ 
          textAlign: 'left', 
          background: '#f9fafb', 
          padding: '1.5rem', 
          borderRadius: '8px',
          fontSize: '0.875rem',
          color: '#374151'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#111827' }}>✅ What's Working:</h3>
          <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
            <li>React 18 + TypeScript</li>
            <li>Vite build system</li>
            <li>State management</li>
            <li>Event handling</li>
            <li>CSS styling</li>
            <li>API fetch calls</li>
          </ul>
          
          <h3 style={{ margin: '1.5rem 0 1rem 0', color: '#111827' }}>🔄 Next Steps:</h3>
          <ol style={{ margin: 0, paddingLeft: '1.5rem' }}>
            <li>If this works, rename <code>App.tsx</code> to <code>App-full.tsx</code></li>
            <li>Rename this file from <code>App-minimal-test.tsx</code> to <code>App.tsx</code></li>
            <li>Gradually add features from the full version</li>
            <li>Test each addition to find what's breaking</li>
          </ol>
        </div>

        <div style={{ marginTop: '2rem', fontSize: '0.875rem', color: '#6b7280' }}>
          <p>Built with React {React.version} • Vite • TypeScript</p>
          <p>If this works but the full app doesn't, check the console for specific errors</p>
        </div>
      </div>
    </div>
  )
}

export default App

import { useEffect, useState } from 'react'

function App(): React.JSX.Element {
  const [version, setVersion] = useState('')

  useEffect(() => {
    void window.electronAPI.getAppVersion().then(setVersion)
  }, [])

  return (
    <main className="app-shell">
      <section className="hero" aria-labelledby="app-title">
        <span className="eyebrow">Local-first active recall</span>
        <h1 id="app-title">Retain</h1>
        <p>
          Prove what you know with text, diagrams, and drawings—then let private,
          on-device AI help schedule what to study next.
        </p>
        <div className="status">
          <span className="status-dot" aria-hidden="true" />
          Electron foundation ready{version ? ` · v${version}` : ''}
        </div>
      </section>
    </main>
  )
}

export default App

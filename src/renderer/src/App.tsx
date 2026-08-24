function App(): React.JSX.Element {
  return (
    <div className="app-layout">
      <aside className="navigation-rail" aria-label="Primary navigation" />
      <main className="main-workspace" aria-label="Main workspace">
        <button className="new-project-control" type="button">
          <span className="new-project-tile" aria-hidden="true">
            <svg viewBox="0 0 24 24" role="presentation">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </span>
          <span className="new-project-label">New Project</span>
        </button>
      </main>
      <aside className="side-panel" aria-label="Secondary panel" />
    </div>
  )
}

export default App

import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent, KeyboardEvent } from 'react'
import projectIconPlaceholder from './assets/project-icon-placeholder.png'

const languages = ['Auto-detect', 'English', 'German', 'French', 'Spanish', 'Arabic']

function App(): React.JSX.Element {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [topics, setTopics] = useState<string[]>([])
  const [topicDraft, setTopicDraft] = useState('')
  const [iconPreview, setIconPreview] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (iconPreview) URL.revokeObjectURL(iconPreview)
    }
  }, [iconPreview])

  const openDialog = (): void => dialogRef.current?.showModal()
  const closeDialog = (): void => dialogRef.current?.close()

  const addTopic = (): void => {
    const topic = topicDraft.trim().replace(/,$/, '')

    if (topic && !topics.some((existingTopic) => existingTopic.toLowerCase() === topic.toLowerCase())) {
      setTopics((currentTopics) => [...currentTopics, topic])
    }

    setTopicDraft('')
  }

  const handleTopicKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault()
      addTopic()
    }
  }

  const removeTopic = (topicToRemove: string): void => {
    setTopics((currentTopics) => currentTopics.filter((topic) => topic !== topicToRemove))
  }

  const handleIconChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0]
    if (!file) return

    setIconPreview((currentPreview) => {
      if (currentPreview) URL.revokeObjectURL(currentPreview)
      return URL.createObjectURL(file)
    })
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    addTopic()
    closeDialog()
  }

  return (
    <div className="app-layout">
      <aside className="navigation-rail" aria-label="Primary navigation" />
      <main className="main-workspace" aria-label="Main workspace">
        <button className="new-project-control" type="button" onClick={openDialog}>
          <span className="new-project-tile" aria-hidden="true">
            <svg viewBox="0 0 24 24" role="presentation">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </span>
          <span className="new-project-label">New Project</span>
        </button>
      </main>
      <aside className="side-panel" aria-label="Secondary panel" />

      <dialog ref={dialogRef} className="project-dialog" aria-labelledby="project-dialog-title">
        <form className="project-form" onSubmit={handleSubmit}>
          <header className="dialog-header">
            <div>
              <span className="dialog-eyebrow">Project setup</span>
              <h1 id="project-dialog-title">Create a new project</h1>
            </div>
            <button className="icon-button" type="button" aria-label="Close dialog" onClick={closeDialog}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
          </header>

          <div className="dialog-content">
            <section className="icon-field" aria-labelledby="icon-field-label">
              <span id="icon-field-label" className="field-label">
                Project icon
              </span>
              <label className="icon-upload">
                <input type="file" accept="image/*" onChange={handleIconChange} />
                <img src={iconPreview ?? projectIconPlaceholder} alt="Project icon preview" />
                <span>{iconPreview ? 'Change image' : 'Choose image'}</span>
              </label>
            </section>

            <div className="project-fields">
              <label className="field">
                <span className="field-label">Name</span>
                <input name="name" type="text" placeholder="e.g. Machine Learning" autoFocus required />
              </label>

              <label className="field">
                <span className="field-label">Description</span>
                <textarea name="description" placeholder="What will you study in this project?" rows={3} />
              </label>

              <div className="field">
                <label className="field-label" htmlFor="topics">
                  Topics
                </label>
                <div className="tag-input" onClick={() => document.getElementById('topics')?.focus()}>
                  {topics.map((topic) => (
                    <span className="topic-tag" key={topic}>
                      {topic}
                      <button type="button" aria-label={`Remove ${topic}`} onClick={() => removeTopic(topic)}>
                        ×
                      </button>
                    </span>
                  ))}
                  <input
                    id="topics"
                    value={topicDraft}
                    placeholder={topics.length ? 'Add another…' : 'Type a topic and press Enter'}
                    onBlur={addTopic}
                    onChange={(event) => setTopicDraft(event.target.value)}
                    onKeyDown={handleTopicKeyDown}
                  />
                </div>
                <span className="field-hint">Press Enter or comma to add a tag.</span>
              </div>

              <label className="field">
                <span className="field-label">Language</span>
                <select name="language" defaultValue="Auto-detect">
                  {languages.map((language) => (
                    <option key={language}>{language}</option>
                  ))}
                </select>
              </label>

              <fieldset className="study-plan">
                <legend className="field-label">Study plan</legend>
                <label className="field compact-field">
                  <span>Target date</span>
                  <input name="targetDate" type="date" />
                </label>
                <label className="field compact-field">
                  <span>Daily goal</span>
                  <div className="input-suffix">
                    <input name="dailyGoal" type="number" min="1" max="500" defaultValue="20" />
                    <span>reviews</span>
                  </div>
                </label>
              </fieldset>
            </div>
          </div>

          <footer className="dialog-actions">
            <button className="secondary-button" type="button" onClick={closeDialog}>
              Cancel
            </button>
            <button className="primary-button" type="submit">
              Create project
            </button>
          </footer>
        </form>
      </dialog>
    </div>
  )
}

export default App

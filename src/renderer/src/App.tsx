import { useRef, useState } from 'react'
import type { CSSProperties, ChangeEvent, FormEvent, KeyboardEvent } from 'react'
import projectIconPlaceholder from './assets/project-icon-placeholder.png'

const languages = ['Auto-detect', 'English', 'German', 'French', 'Spanish', 'Arabic']

const projectPalettes = [
  ['#1677ff', '#73b6ff'],
  ['#ff334f', '#ff8b73'],
  ['#7657ff', '#b69cff'],
  ['#00a783', '#72ddbc'],
  ['#e68a00', '#ffd166'],
  ['#008fbd', '#79d8ed']
] as const

type Project = {
  id: string
  name: string
  description: string
  topics: string[]
  language: string
  targetDate: string
  dailyGoal: number
  iconUrl: string | null
  palette: (typeof projectPalettes)[number]
}

function App(): React.JSX.Element {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [topics, setTopics] = useState<string[]>([])
  const [topicDraft, setTopicDraft] = useState('')
  const [iconPreview, setIconPreview] = useState<string | null>(null)
  const [projects, setProjects] = useState<Project[]>([])

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

    const reader = new FileReader()
    reader.addEventListener('load', () => {
      if (typeof reader.result === 'string') setIconPreview(reader.result)
    })
    reader.readAsDataURL(file)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const pendingTopic = topicDraft.trim().replace(/,$/, '')
    const submittedTopics = pendingTopic
      ? [...topics.filter((topic) => topic.toLowerCase() !== pendingTopic.toLowerCase()), pendingTopic]
      : topics
    const palette = projectPalettes[Math.floor(Math.random() * projectPalettes.length)]

    setProjects((currentProjects) => [
      ...currentProjects,
      {
        id: crypto.randomUUID(),
        name: String(formData.get('name')).trim(),
        description: String(formData.get('description')).trim(),
        topics: submittedTopics,
        language: String(formData.get('language')),
        targetDate: String(formData.get('targetDate')),
        dailyGoal: Number(formData.get('dailyGoal')),
        iconUrl: iconPreview,
        palette
      }
    ])

    form.reset()
    setTopics([])
    setTopicDraft('')
    setIconPreview(null)
    closeDialog()
  }

  return (
    <div className="app-layout">
      <aside className="navigation-rail" aria-label="Primary navigation" />
      <main className="main-workspace" aria-label="Main workspace">
        <div className="project-grid">
          <button className="new-project-control" type="button" onClick={openDialog}>
            <span className="new-project-tile" aria-hidden="true">
              <svg viewBox="0 0 24 24" role="presentation">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </span>
            <span className="new-project-label">New Project</span>
          </button>

          {projects.map((project) => (
            <button
              className="project-card"
              type="button"
              key={project.id}
              aria-label={`Open ${project.name}`}
              style={
                {
                  '--project-color-start': project.palette[0],
                  '--project-color-end': project.palette[1]
                } as CSSProperties
              }
            >
              <span className="project-card-cover" aria-hidden="true">
                {project.iconUrl ? (
                  <img src={project.iconUrl} alt="" />
                ) : (
                  <svg className="default-project-icon" viewBox="0 0 72 58">
                    <path d="M15 11h30a5 5 0 0 1 5 5v35H15a5 5 0 0 1-5-5V16a5 5 0 0 1 5-5Z" />
                    <path d="M23 6h30a5 5 0 0 1 5 5v40H23a5 5 0 0 1-5-5V11a5 5 0 0 1 5-5Z" />
                    <path d="M29 18h20M29 26h20M29 34h15" />
                  </svg>
                )}
              </span>
              <span className="project-card-body">
                <span className="project-card-heading">
                  <strong className="project-card-title">{project.name}</strong>
                  <span className="project-card-options" aria-hidden="true">
                    •••
                  </span>
                </span>
                <span className="project-card-description">{project.description || 'Study project'}</span>
                <span className="project-card-count">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8 7V5a2 2 0 0 1 2-2h7l4 4v10a2 2 0 0 1-2 2h-2" />
                    <path d="M5 7h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z" />
                  </svg>
                  0 items
                </span>
              </span>
            </button>
          ))}
        </div>
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

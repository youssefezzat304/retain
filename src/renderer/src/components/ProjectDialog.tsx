import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent, KeyboardEvent } from 'react'
import projectIconPlaceholder from '../assets/project-icon-placeholder.png'
import {
  createEmptyProjectDraft,
  languages,
  type ProjectDialogState,
  type ProjectDraft
} from '../project-model'

type ProjectDialogProps = {
  state: ProjectDialogState
  onClose: () => void
  onSubmit: (draft: ProjectDraft) => void
}

export function ProjectDialog({ state, onClose, onSubmit }: ProjectDialogProps): React.JSX.Element {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [draft, setDraft] = useState<ProjectDraft>(createEmptyProjectDraft)
  const [topicDraft, setTopicDraft] = useState('')

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (!state) {
      if (dialog.open) dialog.close()
      return
    }

    const nextDraft = state.kind === 'edit' ? state.project : createEmptyProjectDraft()
    setDraft({
      name: nextDraft.name,
      description: nextDraft.description,
      topics: [...nextDraft.topics],
      language: nextDraft.language,
      targetDate: nextDraft.targetDate,
      dailyGoal: nextDraft.dailyGoal,
      iconUrl: nextDraft.iconUrl
    })
    setTopicDraft('')
    formRef.current?.reset()

    if (!dialog.open) dialog.showModal()
  }, [state])

  const addTopic = (): void => {
    const topic = topicDraft.trim().replace(/,$/, '')
    if (!topic) return

    setDraft((currentDraft) => ({
      ...currentDraft,
      topics: currentDraft.topics.some(
        (existingTopic) => existingTopic.toLowerCase() === topic.toLowerCase()
      )
        ? currentDraft.topics
        : [...currentDraft.topics, topic]
    }))
    setTopicDraft('')
  }

  const handleTopicKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault()
      addTopic()
    }
  }

  const handleIconChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.addEventListener('load', () => {
      if (typeof reader.result === 'string') {
        setDraft((currentDraft) => ({ ...currentDraft, iconUrl: reader.result as string }))
      }
    })
    reader.readAsDataURL(file)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const pendingTopic = topicDraft.trim().replace(/,$/, '')
    const topics = pendingTopic
      ? [...draft.topics.filter((topic) => topic.toLowerCase() !== pendingTopic.toLowerCase()), pendingTopic]
      : draft.topics

    onSubmit({ ...draft, name: draft.name.trim(), description: draft.description.trim(), topics })
  }

  const isEditing = state?.kind === 'edit'

  return (
    <dialog
      ref={dialogRef}
      className="project-dialog"
      aria-labelledby="project-dialog-title"
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
    >
      <form ref={formRef} className="project-form" onSubmit={handleSubmit}>
        <header className="dialog-header">
          <div>
            <span className="dialog-eyebrow">Project setup</span>
            <h1 id="project-dialog-title">{isEditing ? 'Edit project' : 'Create a new project'}</h1>
          </div>
          <button className="icon-button" type="button" aria-label="Close dialog" onClick={onClose}>
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
              <img src={draft.iconUrl ?? projectIconPlaceholder} alt="Project icon preview" />
              <span>{draft.iconUrl ? 'Change image' : 'Choose image'}</span>
            </label>
          </section>

          <div className="project-fields">
            <label className="field">
              <span className="field-label">Name</span>
              <input
                type="text"
                placeholder="e.g. Machine Learning"
                value={draft.name}
                autoFocus
                required
                onChange={(event) => setDraft({ ...draft, name: event.target.value })}
              />
            </label>

            <label className="field">
              <span className="field-label">Description</span>
              <textarea
                placeholder="What will you study in this project?"
                rows={3}
                value={draft.description}
                onChange={(event) => setDraft({ ...draft, description: event.target.value })}
              />
            </label>

            <div className="field">
              <label className="field-label" htmlFor="topics">
                Topics
              </label>
              <div className="tag-input" onClick={() => document.getElementById('topics')?.focus()}>
                {draft.topics.map((topic) => (
                  <span className="topic-tag" key={topic}>
                    {topic}
                    <button
                      type="button"
                      aria-label={`Remove ${topic}`}
                      onClick={() =>
                        setDraft({ ...draft, topics: draft.topics.filter((currentTopic) => currentTopic !== topic) })
                      }
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  id="topics"
                  value={topicDraft}
                  placeholder={draft.topics.length ? 'Add another…' : 'Type a topic and press Enter'}
                  onBlur={addTopic}
                  onChange={(event) => setTopicDraft(event.target.value)}
                  onKeyDown={handleTopicKeyDown}
                />
              </div>
              <span className="field-hint">Press Enter or comma to add a tag.</span>
            </div>

            <label className="field">
              <span className="field-label">Language</span>
              <select
                value={draft.language}
                onChange={(event) => setDraft({ ...draft, language: event.target.value })}
              >
                {languages.map((language) => (
                  <option key={language}>{language}</option>
                ))}
              </select>
            </label>

            <fieldset className="study-plan">
              <legend className="field-label">Study plan</legend>
              <label className="field compact-field">
                <span>Target date</span>
                <input
                  type="date"
                  value={draft.targetDate}
                  onChange={(event) => setDraft({ ...draft, targetDate: event.target.value })}
                />
              </label>
              <label className="field compact-field">
                <span>Daily goal</span>
                <div className="input-suffix">
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={draft.dailyGoal}
                    onChange={(event) => setDraft({ ...draft, dailyGoal: Number(event.target.value) })}
                  />
                  <span>reviews</span>
                </div>
              </label>
            </fieldset>
          </div>
        </div>

        <footer className="dialog-actions">
          <button className="secondary-button" type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="primary-button" type="submit">
            {isEditing ? 'Save changes' : 'Create project'}
          </button>
        </footer>
      </form>
    </dialog>
  )
}

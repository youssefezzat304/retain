import { useState } from 'react'
import type { Project } from '../project-model'

const questionTypes = [
  {
    id: 'text-answer',
    label: 'Text answer',
    description: 'Write an answer in your own words for semantic grading.'
  },
  {
    id: 'true-false',
    label: 'True or False',
    description: 'Decide whether a statement is correct or incorrect.'
  },
  {
    id: 'multiple-choice',
    label: 'Multiple choice',
    description: 'Choose the correct answer from a set of options.'
  }
] as const

type QuestionTypePickerProps = {
  project: Project
  onBack: () => void
}

export function QuestionTypePicker({ project, onBack }: QuestionTypePickerProps): React.JSX.Element {
  const [selectedType, setSelectedType] = useState<string | null>(null)

  return (
    <section className="question-type-view" aria-labelledby="question-type-title">
      <button className="workspace-back-button" type="button" onClick={onBack}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m15 18-6-6 6-6" />
        </svg>
        All projects
      </button>

      <header className="question-type-header">
        <span className="workspace-eyebrow">Add question</span>
        <h1 id="question-type-title" title={project.name}>
          {project.name}
        </h1>
        <p>Choose the kind of answer you want the student to produce.</p>
      </header>

      <div className="question-type-grid">
        {questionTypes.map((questionType) => (
          <button
            className="question-type-card"
            type="button"
            key={questionType.id}
            data-selected={selectedType === questionType.id}
            onClick={() => setSelectedType(questionType.id)}
          >
            <span className="question-type-icon" aria-hidden="true">
              {questionType.id === 'text-answer' && (
                <svg viewBox="0 0 24 24">
                  <path d="M5 5h14v11H9l-4 3V5ZM9 9h6M9 12h4" />
                </svg>
              )}
              {questionType.id === 'true-false' && (
                <svg viewBox="0 0 24 24">
                  <path d="m4 12 4 4 6-8M16 9l5 5M21 9l-5 5" />
                </svg>
              )}
              {questionType.id === 'multiple-choice' && (
                <svg viewBox="0 0 24 24">
                  <circle cx="6" cy="7" r="2" />
                  <circle cx="6" cy="17" r="2" />
                  <path d="M11 7h9M11 17h9" />
                </svg>
              )}
            </span>
            <span className="question-type-copy">
              <strong>{questionType.label}</strong>
              <span>{questionType.description}</span>
            </span>
            <span className="question-type-arrow" aria-hidden="true">
              →
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}

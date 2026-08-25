import { useState } from 'react'
import { ProjectDialog } from './components/ProjectDialog'
import { ProjectGrid } from './components/ProjectGrid'
import { QuestionTypePicker } from './components/QuestionTypePicker'
import {
  projectPalettes,
  type Project,
  type ProjectDialogState,
  type ProjectDraft,
  type WorkspaceView
} from './project-model'

function App(): React.JSX.Element {
  const [projects, setProjects] = useState<Project[]>([])
  const [dialogState, setDialogState] = useState<ProjectDialogState>(null)
  const [workspaceView, setWorkspaceView] = useState<WorkspaceView>({ kind: 'projects' })

  const handleProjectSubmit = (draft: ProjectDraft): void => {
    if (dialogState?.kind === 'edit') {
      const projectId = dialogState.project.id
      setProjects((currentProjects) =>
        currentProjects.map((project) => (project.id === projectId ? { ...project, ...draft } : project))
      )
    } else {
      const palette = projectPalettes[Math.floor(Math.random() * projectPalettes.length)]
      setProjects((currentProjects) => [
        ...currentProjects,
        {
          ...draft,
          id: crypto.randomUUID(),
          palette
        }
      ])
    }

    setDialogState(null)
  }

  const selectedProject =
    workspaceView.kind === 'question-types'
      ? projects.find((project) => project.id === workspaceView.projectId)
      : undefined

  return (
    <div className="app-layout">
      <aside className="navigation-rail" aria-label="Primary navigation" />
      <main className="main-workspace" aria-label="Main workspace">
        {workspaceView.kind === 'projects' && (
          <ProjectGrid
            projects={projects}
            onCreate={() => setDialogState({ kind: 'create' })}
            onEdit={(project) => setDialogState({ kind: 'edit', project })}
            onAdd={(project) => setWorkspaceView({ kind: 'question-types', projectId: project.id })}
            onDelete={(projectId) =>
              setProjects((currentProjects) =>
                currentProjects.filter((currentProject) => currentProject.id !== projectId)
              )
            }
          />
        )}

        {workspaceView.kind === 'question-types' && selectedProject && (
          <QuestionTypePicker project={selectedProject} onBack={() => setWorkspaceView({ kind: 'projects' })} />
        )}
      </main>
      <aside className="side-panel" aria-label="Secondary panel" />

      <ProjectDialog state={dialogState} onClose={() => setDialogState(null)} onSubmit={handleProjectSubmit} />
    </div>
  )
}

export default App

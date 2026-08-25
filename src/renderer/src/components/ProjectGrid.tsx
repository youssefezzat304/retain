import { useState } from 'react'
import type { Project } from '../project-model'
import { ProjectCard } from './ProjectCard'

type ProjectGridProps = {
  projects: Project[]
  onCreate: () => void
  onEdit: (project: Project) => void
  onAdd: (project: Project) => void
  onDelete: (projectId: string) => void
}

export function ProjectGrid({ projects, onCreate, onEdit, onAdd, onDelete }: ProjectGridProps): React.JSX.Element {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  return (
    <div className="project-grid" onClick={() => setOpenMenuId(null)}>
      <button className="new-project-control" type="button" onClick={onCreate}>
        <span className="new-project-tile" aria-hidden="true">
          <svg viewBox="0 0 24 24" role="presentation">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </span>
        <span className="new-project-label">New Project</span>
      </button>

      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          menuOpen={openMenuId === project.id}
          onOpen={() => onAdd(project)}
          onToggleMenu={() => setOpenMenuId((currentId) => (currentId === project.id ? null : project.id))}
          onEdit={() => {
            setOpenMenuId(null)
            onEdit(project)
          }}
          onAdd={() => {
            setOpenMenuId(null)
            onAdd(project)
          }}
          onDelete={() => {
            setOpenMenuId(null)
            onDelete(project.id)
          }}
          onCloseMenu={() => setOpenMenuId(null)}
        />
      ))}
    </div>
  )
}

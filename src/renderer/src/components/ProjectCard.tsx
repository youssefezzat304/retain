import type { CSSProperties } from 'react'
import type { Project } from '../project-model'

type ProjectCardProps = {
  project: Project
  menuOpen: boolean
  onOpen: () => void
  onToggleMenu: () => void
  onEdit: () => void
  onAdd: () => void
  onDelete: () => void
  onCloseMenu: () => void
}

export function ProjectCard({
  project,
  menuOpen,
  onOpen,
  onToggleMenu,
  onEdit,
  onAdd,
  onDelete,
  onCloseMenu
}: ProjectCardProps): React.JSX.Element {
  return (
    <article
      className="project-card"
      style={
        {
          '--project-color-start': project.palette[0],
          '--project-color-end': project.palette[1]
        } as CSSProperties
      }
    >
      <button className="project-card-surface" type="button" aria-label={`Open ${project.name}`} onClick={onOpen}>
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
            <strong className="project-card-title" title={project.name}>
              {project.name}
            </strong>
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

      <button
        className="project-menu-trigger"
        type="button"
        aria-label={`Actions for ${project.name}`}
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        onClick={(event) => {
          event.stopPropagation()
          onToggleMenu()
        }}
      >
        <span aria-hidden="true">•••</span>
      </button>

      {menuOpen && (
        <div className="project-menu" role="menu" aria-label={`Actions for ${project.name}`}>
          <button type="button" role="menuitem" onClick={onEdit}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17l-1 3ZM14.5 7.5l3 3" />
            </svg>
            Edit
          </button>
          <button type="button" role="menuitem" onClick={onAdd}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add question
          </button>
          <button type="button" role="menuitem" onClick={onCloseMenu}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 7h10M18 7h2M4 17h2M10 17h10M14 4v6M6 14v6" />
            </svg>
            Settings
          </button>
          <div className="project-menu-separator" role="separator" />
          <button className="destructive-menu-item" type="button" role="menuitem" onClick={onDelete}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" />
            </svg>
            Delete
          </button>
        </div>
      )}
    </article>
  )
}

export const languages = ['Auto-detect', 'English', 'German', 'French', 'Spanish', 'Arabic']

export const projectPalettes = [
  ['#1677ff', '#73b6ff'],
  ['#ff334f', '#ff8b73'],
  ['#7657ff', '#b69cff'],
  ['#00a783', '#72ddbc'],
  ['#e68a00', '#ffd166'],
  ['#008fbd', '#79d8ed']
] as const

export type ProjectPalette = (typeof projectPalettes)[number]

export type ProjectDraft = {
  name: string
  description: string
  topics: string[]
  language: string
  targetDate: string
  dailyGoal: number
  iconUrl: string | null
}

export type Project = ProjectDraft & {
  id: string
  palette: ProjectPalette
}

export type ProjectDialogState =
  | { kind: 'create' }
  | { kind: 'edit'; project: Project }
  | null

export type WorkspaceView = { kind: 'projects' } | { kind: 'question-types'; projectId: string }

export function createEmptyProjectDraft(): ProjectDraft {
  return {
    name: '',
    description: '',
    topics: [],
    language: 'Auto-detect',
    targetDate: '',
    dailyGoal: 20,
    iconUrl: null
  }
}

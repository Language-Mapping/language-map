import { RouteLocation } from 'components/config/types'

export type MapPanel = {
  heading: string
  component: React.ReactNode
  rootPath: RouteLocation
  exact?: boolean
  icon?: React.ReactNode
}

export type MapPanelProps = {
  setPanelOpen: React.Dispatch<boolean>
  panelOpen: boolean
}

// TODO: detangle this mess like a professional web developer
export type PanelContentProps = {
  icon?: React.ReactNode
  intro?: string | React.ReactNode
  subSubtitle?: string | React.ReactNode
  subtitle?: string | React.ReactNode
  title?: string
}

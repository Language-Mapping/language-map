import { RouteLocation } from 'components/config/types'

export type MapPanel = {
  heading: string
  icon: React.ReactNode
  subheading: string
  component: React.ReactNode
  rootPath: RouteLocation
  intro?: string
  exact?: boolean
  omitDefaults?: boolean // title and breadcrumbs
}

export type MapPanelProps = {
  setPanelOpen: React.Dispatch<boolean>
  panelOpen: boolean
}

export type PanelContentProps = {
  intro?: string | React.ReactNode
  title?: string
  icon?: React.ReactNode
}

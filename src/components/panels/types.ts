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

export type PanelContentProps = {
  intro?: string | React.ReactNode
  title?: string
  icon?: React.ReactNode
}

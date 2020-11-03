import { RouteLocation } from 'components/config/types'

export type MapPanel = {
  heading: string
  icon: React.ReactNode
  component: React.ReactNode
  rootPath: RouteLocation
  exact?: boolean
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

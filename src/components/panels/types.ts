import { RouteLocation, LocState } from 'components/config/types'

export type MapPanel = {
  heading: string
  icon: React.ReactNode
  subheading: string
  component: React.ReactNode
  rootPath: RouteLocation
  locStateKey: null | keyof LocState
  exact?: boolean
}

export type MapPanelProps = {
  panelOpen: boolean
  closePanel: () => void
}

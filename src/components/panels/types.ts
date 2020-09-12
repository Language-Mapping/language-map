import { RouteLocation } from 'components/config/types'

export type MapPanel = {
  heading: string
  icon: React.ReactNode
  subheading: string
  component: React.ReactNode
  path: RouteLocation
}

export type MapPanelProps = {
  active?: boolean
  first?: boolean
  panelOpen?: boolean
}

import { RouteLocation } from 'components/map/types'

export type MapPanel = {
  heading: string
  icon: React.ReactNode
  subheading: string
  component: React.ReactNode
  path: RouteLocation
}

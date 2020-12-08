import { RouteLocation } from 'components/config/types'
import * as MapTypes from 'components/map/types'

export type MapPanel = {
  heading: string
  component: React.ReactNode
  rootPath: RouteLocation
  exact?: boolean
  icon?: React.ReactNode
  // TODO: de-fragilize?
  renderComponent?: (props: MapTypes.SpatialPanelProps) => React.ReactNode
}

export type MapPanelProps = MapTypes.SpatialPanelProps & {
  openOffCanvasNav: (e: React.MouseEvent) => void
  setPanelOpen: React.Dispatch<boolean>
}

// TODO: detangle this mess like a professional web developer, reuse existing
export type PanelContentProps = {
  icon?: React.ReactNode
  subSubtitle?: string | React.ReactNode
  subtitle?: string | React.ReactNode
  title?: string
  extree?: string | React.ReactNode // catch-all stuff for intro bottom
}

export type PanelTitleBarProps = Pick<MapPanelProps, 'openOffCanvasNav'>

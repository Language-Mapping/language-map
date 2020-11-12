import { RouteLocation } from 'components/config/types'
import * as MapTypes from 'components/map/types'

export type MapPanel = {
  heading: string
  component: React.ReactNode
  rootPath: RouteLocation
  exact?: boolean
  icon?: React.ReactNode
  // TODO: de-fragilize?
  renderComponent?: (props: MapTypes.GeocoderProps) => React.ReactNode
}

export type MapPanelProps = MapTypes.GeocoderProps & {
  openOffCanvasNav: (e: React.MouseEvent) => void
  setPanelOpen: React.Dispatch<boolean>
}

// TODO: detangle this mess like a professional web developer
export type PanelContentProps = {
  icon?: React.ReactNode
  intro?: string | React.ReactNode
  subSubtitle?: string | React.ReactNode
  subtitle?: string | React.ReactNode
  title?: string
}

export type PanelTitleBarProps = Pick<MapPanelProps, 'openOffCanvasNav'>

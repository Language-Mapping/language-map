import {
  SourceProps,
  PointerEvent,
  InteractiveMap,
  InteractiveMapProps,
  LayerProps,
  ViewportProps,
  ViewState,
} from 'react-map-gl'
import {
  // LngLatLike, // TODO: use more often
  MapboxGeoJSONFeature,
  MapEventType,
  Map,
  SymbolLayout,
  SymbolPaint,
} from 'mapbox-gl'
import * as GeoJSON from 'geojson'

import { LangRecordSchema } from 'components/context/types'

type InteractiveLayerIds = { lang: string[]; boundaries: string[] }
type Padding =
  | number
  | { top: number; bottom: number; left: number; right: number }

export type BoundsArray = [[number, number], [number, number]]
export type GeocodeMarker = LongLat & { text: string }
export type InitialMapProps = InteractiveMapProps
export type LangIconConfig = { icon: string; id: string }
export type LayerBasics = { 'source-layer': string; id: string }
export type Layer = LayerProps & LayerBasics
export type LongLat = { longitude: number; latitude: number }
export type LongLatAndZoom = LongLat & { zoom: number }
export type MapControlAction =
  | 'home'
  | 'in'
  | 'out'
  | 'info'
  | 'loc-search'
  | 'reset-pitch'
export type PopupContent = { heading: string; subheading?: string }
export type PopupSettings = PopupContent & LongLat
export type SheetsValues = [string, string]
export type UseStyleProps = { panelOpen: boolean }
export type ViewportState = Partial<ViewportProps> & ViewState
export type Breakpoint = 'mobile' | 'desktop' | 'huge'
export type Offset = [number, number] // [x, y]
export type BoundariesInternalSrcID = 'neighborhoods' | 'counties' | 'tracts'

export type LayerPropsPlusMeta = Omit<LayerProps, 'paint' | 'layout' | 'id'> & {
  id: string
  group: keyof LangRecordSchema
  layout: SymbolLayout
  paint: SymbolPaint
}

export type BoundaryConfig = {
  source: SourceWithPromoteID
  layers: Layer[]
  lookupPath: string
}

export type LangFeature = {
  id: number
  geometry: GeoJSON.Geometry
  layer: LayerPropsPlusMeta
  properties: LangRecordSchema
  source: string
  sourceLayer: string
  type: 'Feature' | 'hmmmmmm'
  state: { alsoHmmmm: boolean }
}

export type BoundaryFeat = Omit<
  LangFeature,
  'properties' | 'geometry' | 'source'
> & {
  geometry: GeoJSON.Polygon | GeoJSON.MultiPolygon
  properties: { Name: string; ID: number }
  source: BoundariesInternalSrcID
  'source-layer': string
}

export type BoundariesLayerProps = {
  visible: boolean
  beforeId?: string
} & BoundaryConfig

export type MapEvent = Omit<PointerEvent, 'features'> & {
  features: LangFeature[] | BoundaryFeat[]
}

export type GetWebMercViewport = (
  settings: LongLatAndZoom & {
    bounds: BoundsArray
    padding: Padding
  }
) => LongLatAndZoom

export type GetWebMercCenter = (params: {
  height: number
  lngLat: [number, number]
  pos: [number, number]
  width: number
  zoom: number
  padding?: Padding
}) => [number, number]

export type GeocodeResult = {
  result: {
    center: [number, number]
    text: string
    bbox?: [number, number, number, number]
  }
}

export type PopoutContentProps = {
  heading: string
  explanation?: string
}

export type GeolocationProps = Pick<
  SpatialPanelProps,
  'geolocActive' | 'setGeolocActive'
>

export type CensusToggleProps = SpatialPanelProps

export type MbReadyCensusRow = {
  id: number // MB Boundaries' internal
  fips: string // 2-char state code + 3-char county + 6-char tract
} & { [key: string]: number }

export type CensusLayerProps = Pick<
  BoundariesLayerProps,
  'beforeId' | 'source'
> & {
  map?: Map
  censusField?: string
}

export type MapProps = {
  mapLoaded: boolean
  setMapLoaded: React.Dispatch<boolean>
} & Omit<
  SpatialPanelProps,
  'setBoundariesVisible' | 'setGeolocActive' | 'setCensusField'
>

export type MapCtrlBtnsProps = {
  isPitchZero: boolean
  onMapCtrlClick: (actionID: MapControlAction) => void
}

// TODO: into context if it gets unrulier
export type SpatialPanelProps = {
  boundariesVisible: boolean
  censusField?: string
  geolocActive: boolean
  mapRef: React.RefObject<InteractiveMap>
  panelOpen: boolean
  setBoundariesVisible: React.Dispatch<boolean>
  setGeolocActive: React.Dispatch<boolean>
  setCensusField: React.Dispatch<string>
}

export type CtrlBtnConfig = {
  id: MapControlAction
  icon: React.ReactNode
  name: string
  customFn?: boolean
  disabledOnProp?: keyof MapCtrlBtnsProps
}

export type SourceWithPromoteID = Omit<SourceProps, 'id'> & {
  id: string
  promoteId?: string
}

export type BoundsConfig = {
  height: number
  width: number
  bounds?: BoundsArray
  padding?: Padding
}

export type BoundaryLookup = {
  // It's `feature_id` in MB lookup tables. Manually change to save 8 characters
  // (times 3000...)
  id: number
  bounds: [number, number, number, number]
  name?: string // census tracts don't have one (they DID, but not useful)
  // NOTE: only counties has this. Manually converted to `name` instead.
  // names?: { en: string[] }
}

export type CustomEventData = MapEventType & {
  popupSettings: PopupSettings | null
  forceViewportUpdate?: boolean | true
  geocodeMarker?: GeocodeMarker
}

export type PrepPopupContent = (
  selFeatAttribs: LangRecordSchema | null,
  popupHeading?: string | null
) => PopupContent | null

export type HandleBoundaryClick = (
  map: Map,
  topMostFeat: BoundaryFeat,
  boundsConfig: BoundsConfig,
  lookup: BoundaryLookup[],
  offset?: [number, number]
) => void

export type FlyToBounds = (
  map: Map,
  settings: BoundsConfig & {
    bounds: BoundsArray
    offset: [number, number]
  },
  popupContent: PopupContent | null
) => void

export type FlyToPoint = (
  map: Map,
  settings: LongLatAndZoom & {
    disregardCurrZoom?: boolean
    bearing?: number
    pitch?: number
    offset: [number, number]
  },
  popupContent: PopupContent | null,
  geocodeMarkerText?: string
) => void

export type OnHover = (
  event: MapEvent,
  setTooltip: React.Dispatch<PopupSettings | null>, // same as popup now
  map: Map,
  interactiveLayerIds: InteractiveLayerIds
) => void

export type ClearStuff = (map: Map) => void

export type LangFeatsUnderClick = (
  point: [number, number],
  map: Map,
  interactiveLayerIds: Omit<InteractiveLayerIds, 'boundaries'>
) => MapboxGeoJSONFeature[]

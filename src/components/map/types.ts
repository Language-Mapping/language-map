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
  FillPaint,
  MapboxGeoJSONFeature,
  MapEventType,
  Map,
  SymbolLayout,
  SymbolPaint,
} from 'mapbox-gl'
import * as GeoJSON from 'geojson'

import { InstanceLevelSchema, InternalUse } from 'components/context'
import { CensusScope } from 'components/local/types'
import { Breakpoint } from 'components/generic/types'

type Padding =
  | number
  | { top: number; bottom: number; left: number; right: number }
type SourceWithPromoteID = Omit<SourceProps, 'id'> & {
  id: string
  promoteId?: string
}

export type BaseLayer = 'light' | 'dark' | 'none'
export type BoundsArray = [[number, number], [number, number]]
export type GeocodeMarkerProps = LongLat & { text: string; subtle?: boolean }
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
export type PopupContent = { heading: string; content?: React.ReactNode }
export type PopupSettings = PopupContent & LongLat
export type UseStyleProps = { panelOpen: boolean }
export type ViewportState = Partial<ViewportProps> & ViewState
export type Offset = [number, number] // [x, y] // TODO: rm if

export type LayerPropsPlusMeta = Omit<LayerProps, 'paint' | 'layout' | 'id'> & {
  id: string
  group: keyof InstanceLevelSchema
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
  properties: InstanceLevelSchema
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
  properties: {
    name?: string
    GEOID?: string
    x_max: number
    x_min: number
    y_min: number
    y_max: number
  }
  source: 'neighborhoods' | 'counties'
  'source-layer': string
}

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

export type GeocoderPopoutProps = Pick<MapProps, 'mapRef'>

export type GeocodeResult = {
  result: {
    center: [number, number]
    text: string
    bbox?: [number, number, number, number]
  }
}

export type PanelSectionProps = {
  heading?: string
  explanation?: string | React.ReactNode
}

export type MapProps = {
  mapLoaded: boolean
  setMapLoaded: React.Dispatch<boolean>
  mapRef: React.RefObject<InteractiveMap>
}

export type MapCtrlBtnsProps = {
  isMapTilted: boolean
  onMapCtrlClick: (actionID: MapControlAction) => void
}

export type CtrlBtnConfig = {
  id: MapControlAction
  icon: React.ReactNode
  name: string
  customFn?: boolean
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
  forceViewportUpdate?: boolean | true
  geocodeMarker?: GeocodeMarkerProps
}

export type PrepPopupContent = (
  selFeatAttribs: InstanceLevelSchema | null,
  popupHeading?: string | null
) => PopupContent | null

export type FlyHome = (map: Map, breakpoint: Breakpoint) => void

export type FlyToBounds = (
  map: Map,
  settings: BoundsConfig & {
    bounds: BoundsArray
    breakpoint: Breakpoint
  }
) => void

export type FlyToPoint = (
  map: Map,
  settings: LongLatAndZoom & {
    disregardCurrZoom?: boolean
    bearing?: number
    pitch?: number
  },
  geocodeMarkerText?: string
) => void

export type LangFeatsUnderClick = (
  point: [number, number],
  map: Map,
  interactiveLayerIds: string[]
) => MapboxGeoJSONFeature[]

export type UseLangReturn = {
  feature: InstanceLevelSchema | undefined
  stateReady: boolean
}

export type UseLayersConfig = {
  data: LayerPropsPlusMeta[]
  isLoading: boolean
  error: unknown
}

// Not a component, but shared by several
export type MapPopupsProps = {
  handleClose: () => void
}

export type PolygonPopupProps = MapPopupsProps & {
  tableName: 'Neighborhood' | 'County'
  addlFields?: string[]
}

export type MapPopupProps = PopupSettings & Pick<MapPopupsProps, 'handleClose'>

export type SelFeatAttribs = InternalUse

export type FlyToPointSettings = {
  longitude: number
  latitude: number
  zoom: number
  disregardCurrZoom: boolean
  pitch: number
}

export type UseZoomToLangFeatsExtent = (
  isMapTilted: boolean,
  map?: Map
) => boolean

export type CensusTableRow = { [key: string]: number } & {
  GEOID: string
  Neighborhood?: string // puma-only (curated column, not part of orig dataset)
} & BoundsColumns

export type UseCensusSymbReturn = {
  isLoading: boolean
  visible: boolean
  fillPaint: FillPaint
  error?: unknown
}

export type UseCensusSymb = (
  sourceLayer: string,
  censusScope: CensusScope,
  mapLoaded: boolean,
  map?: Map
) => UseCensusSymbReturn

export type UseSelLangPointCoordsReturn = {
  lat: number | null
  lon: number | null
}

type UsePolygonWebMercReturn = {
  x_max: number | null
  x_min: number | null
  y_min: number | null
  y_max: number | null
}

export type UsePolygonWebMerc = (
  routePath: string,
  tableName: string
) => UsePolygonWebMercReturn

export type BoundsColumns = {
  x_max: number
  x_min: number
  y_min: number
  y_max: number
}

export type NeighborhoodTableSchema = BoundsColumns & {
  name: string
  County: string // or NYC borough
}

export type CountyTableSchema = BoundsColumns & {
  name: string
}

export type UseZoomToBounds = (
  routePath: string,
  tableName: string,
  mapLoaded: boolean,
  map?: Map
) => void

export type SrcAndFeatID = { srcID: string; featID: string }

export type OnHover = (
  event: MapEvent,
  setTooltip: React.Dispatch<Tooltip | null>,
  map?: Map
) => void

export type Tooltip = GeocodeMarkerProps
export type UseRenameLaterUgh = () => SrcAndFeatID | undefined

export type PolygonLayerProps = {
  configKey: string
  beforeId?: string
  mapLoaded: boolean
  map?: Map
}

export type CensusLayerProps = PolygonLayerProps

export type UsePolySelFeatSymb = (
  settings: Omit<PolygonLayerProps, 'beforeId'>
) => void

export type LangMbSrcAndLayerProps = {
  isMapTilted: boolean
  mapLoaded: boolean
  map?: Map
}

export type SelectedPolygonProps = PolygonLayerProps & {
  selLineColor: string
  selFillColor?: string
}

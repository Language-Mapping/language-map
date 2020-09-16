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
  CircleLayout,
  CirclePaint,
  Map,
  SymbolLayout,
  SymbolPaint,
} from 'mapbox-gl'
import * as GeoJSON from 'geojson'

import { LangRecordSchema } from 'context/types'

type InteractiveLayerIds = { lang: string[]; boundaries: string[] }
type Padding =
  | number
  | { top: number; bottom: number; left: number; right: number }

export type Baselayer = 'dark' | 'light' // assumes using Mapbox style
export type BoundsArray = [[number, number], [number, number]]
export type LangIconConfig = { icon: string; id: string }
export type Layer = LayerProps & { 'source-layer': string; id: string }
export type LongLat = { longitude: number; latitude: number }
export type LongLatAndZoom = LongLat & { zoom: number }
export type MapControlAction = 'home' | 'in' | 'out' | 'info' | 'loc-search'
export type PopupContent = { heading: string; subheading?: string }
export type PopupSettings = PopupContent & LongLat
export type GeocodeMarker = LongLat & { text: string }
export type ViewportState = Partial<ViewportProps> & ViewState
export type InitialMapProps = InteractiveMapProps
export type SheetsValues = [string, string]

// MB Styles API individual group in the `metadata` of JSON response
export type MetadataGroup = { [mbGroupIdHash: string]: { name: string } }

// `metadata` prop has MB Studio group ID and appears to only be part of the
// Style API, not the Style Spec.
export type LayerPropsPlusMeta = Omit<
  LayerProps,
  'type' | 'paint' | 'layout' | 'id'
> & {
  id: string
  metadata: { 'mapbox:group': keyof MetadataGroup }
  type: 'circle' | 'symbol' | 'background'
  layout: CircleLayout | SymbolLayout
  paint: CirclePaint | SymbolPaint
}

export type BoundaryConfig = {
  source: SourceWithPromoteID
  layers: Layer[]
  lookupPath: string
}

// Same but only circle or symbol types
export type LayerPropsNonBGlayer = Omit<LayerPropsPlusMeta, 'type'> & {
  type: 'circle' | 'symbol'
}

// API response from Styles API. Not the same as what comes back in map.target
export type MbResponse = {
  metadata: { 'mapbox:groups': MetadataGroup }
  layers: LayerPropsPlusMeta[]
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
  source: 'neighorhoods' | 'counties'
}

export type MapEvent = Omit<PointerEvent, 'features'> & {
  features: LangFeature[] | BoundaryFeat[]
}

export type MapComponent = {
  baselayer: Baselayer
  symbLayers: LayerPropsNonBGlayer[]
}

export type GetWebMercViewport = (
  settings: Omit<BoundsConfig, 'bounds'> & {
    bounds: BoundsArray
    padding?: Padding
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

export type UseStyleProps = { panelOpen: boolean }

export type GeocodeResult = {
  result: {
    center: [number, number]
    text: string
    bbox?: [number, number, number, number]
  }
}

export type MapCtrlBtnsProps = {
  mapRef: React.RefObject<InteractiveMap>
  onMapCtrlClick: (actionID: MapControlAction) => void
}

export type CtrlBtnConfig = {
  id: MapControlAction
  icon: React.ReactNode
  name: string
  customFn?: boolean
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
  feature_id: number
  centroid: [number, number]
  bounds: [number, number, number, number]
  name?: string // neighb and county have it, but `names` is ideal in counties
  names?: { en: string[] } // only counties has this
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
  topMostFeat: LangFeature | BoundaryFeat,
  boundsConfig: BoundsConfig,
  lookup?: BoundaryLookup[]
) => void

export type FlyToBounds = (
  map: Map,
  settings: BoundsConfig & {
    bounds: BoundsArray
  },
  popupContent: PopupContent | null
) => void

export type FlyToPoint = (
  map: Map,
  settings: LongLatAndZoom & { disregardCurrZoom?: boolean },
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

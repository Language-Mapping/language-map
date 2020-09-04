import {
  SourceProps,
  PointerEvent,
  InteractiveMap,
  LayerProps,
} from 'react-map-gl'
import {
  CircleLayout,
  CirclePaint,
  Map,
  SymbolLayout,
  SymbolPaint,
} from 'mapbox-gl'
import * as GeoJSON from 'geojson'

import { LangRecordSchema } from 'context/types'

export type Baselayer = 'dark' | 'light' // assumes using Mapbox style
export type BoundaryConfig = {
  source: SourceWithPromoteID
  layers: Layer[]
  lookupPath: string
}
export type BoundsArray = [[number, number], [number, number]]
export type LangIconConfig = { icon: string; id: string }
export type Layer = LayerProps & { 'source-layer': string }
export type LongLat = { longitude: number; latitude: number }
export type MapControlAction = 'home' | 'in' | 'out' | 'info' | 'loc-search'
export type MapViewportState = { zoom: number } & LongLat

// TODO: 1. enforce in all relevant spots, 2. mv into context/types
export type RouteLocation = '/' | '/details' | '/table' | '/about' | '/glossary'

// MB Styles API individual group in the `metadata` of JSON response
export type MetadataGroup = { [mbGroupIdHash: string]: { name: string } }

// `metadata` prop has MB Studio group ID and appears to only be part of the
// Style API, not the Style Spec.
export type LayerPropsPlusMeta = Omit<
  LayerProps,
  'type' | 'paint' | 'layout'
> & {
  metadata: { 'mapbox:group': keyof MetadataGroup }
  type: 'circle' | 'symbol' | 'background'
  layout: CircleLayout | SymbolLayout
  paint: CirclePaint | SymbolPaint
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

export type MapPanel = {
  heading: string
  icon: React.ReactNode
  subheading: string
  component: React.ReactNode
  path: RouteLocation
}

export type MapTooltip = LongLat & {
  heading: string
  subHeading: string
}

export type MapComponent = {
  baselayer: Baselayer
  wrapClassName: string
  symbLayers: LayerPropsNonBGlayer[]
  labelLayers: LayerPropsNonBGlayer[]
}

export type FlyToCoords = (
  map: Map,
  settings: {
    zoom?: number | 10.25
    disregardCurrZoom?: boolean // e.g. when using map controls
  } & LongLat,
  offset: [number, number],
  selFeatAttribs: LangRecordSchema | null
) => void

export type UseStyleProps = {
  panelOpen: boolean
  screenHeight: number
}

export type GeocodeResult = {
  result: {
    center: [number, number]
    bbox?: [number, number, number, number]
  }
}

export type MapCtrlBtnsProps = {
  isDesktop: boolean
  mapOffset: [number, number]
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
  isDesktop: boolean
  mapOffset: [number, number]
  width: number
}

export type MbBoundaryLookup = {
  feature_id: number
  centroid: [number, number]
  bounds: [number, number, number, number]
  name?: string // neighb and county have it, but `names` is ideal in counties
  names?: { en: string[] } // only counties has this
}

export type PopupClean = {
  heading: string
  latitude: number
  longitude: number
  subheading?: string
}

import { PointerEvent, LayerProps } from 'react-map-gl'
import * as mbGlFull from 'mapbox-gl'

import { LangRecordSchema } from 'context/types'

export type LongLat = {
  longitude: number
  latitude: number
}

export type MapViewportState = {
  zoom: number
} & LongLat

// Assumes using Mapbox style
export type Baselayer = 'dark' | 'light'

// MB Styles API individual group in the `metadata` of JSON response
export type MetadataGroup = {
  [mbGroupIdHash: string]: {
    name: string
  }
}

// `metadata` prop has MB Studio group ID and appears to only be part of the
// Style API, not the Style Spec.
export type LayerPropsPlusMeta = Omit<
  LayerProps,
  'type' | 'paint' | 'layout'
> & {
  metadata: {
    'mapbox:group': keyof MetadataGroup
  }
  type: 'circle' | 'symbol' | 'background'
  layout: mbGlFull.CircleLayout | mbGlFull.SymbolLayout
  paint: mbGlFull.CirclePaint | mbGlFull.SymbolPaint
}

// Same but only circle or symbol types
export type LayerPropsNonBGlayer = Omit<LayerPropsPlusMeta, 'type'> & {
  type: 'circle' | 'symbol'
}

// API response from Styles API. Not the same as what comes back in map.target
export type MbResponse = {
  metadata: {
    'mapbox:groups': MetadataGroup
  }
  layers: LayerPropsPlusMeta[]
}

export type LangFeature = {
  id: number
  layer: LayerPropsPlusMeta
  properties: LangRecordSchema
  source: string
  sourceLayer: string
  type: 'Feature' | 'hmmmmmm'
  state: {
    alsoHmmmm: boolean
  }
}

export type MapEvent = Omit<PointerEvent, 'features'> & {
  features: LangFeature[]
}

export type MapPanel = {
  heading: string
  icon: React.ReactNode
  subheading: string
  component: React.ReactNode
  summary: null | React.ReactNode | string
}

export type MapPopup = LongLat & {
  selFeatAttribs: LangRecordSchema
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

export type LangIconConfig = { icon: string; id: string }

export type MapControlAction = 'home' | 'in' | 'out'

export type FlyToCoords = (
  map: mbGlFull.Map,
  settings: {
    zoom?: number | 10.25
    disregardCurrZoom?: boolean // e.g. when using map controls
  } & LongLat,
  offset: [number, number],
  selFeatAttribs: LangRecordSchema | null
) => void

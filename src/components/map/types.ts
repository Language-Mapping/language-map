import { PointerEvent, LayerProps } from 'react-map-gl'
import * as mbGlFull from 'mapbox-gl'

import { LangRecordSchema, LayerVisibilityTypes } from 'context/types'

// Assumes using Mapbox style
export type BaselayerType = 'dark' | 'light'

export type LayerToggleType = {
  name: string
  layerId: keyof LayerVisibilityTypes
}

export type LegendSwatchType = {
  type: 'circle' | 'symbol'
  legendLabel: string
  backgroundColor?: string
  iconID?: string
  size?: number
}

// Same as the regular swatch but will have SVG element if it is a symbol
export type LegendSwatchComponent = LegendSwatchType & {
  icon?: string
}

// MB Styles API individual group in the `metadata` of JSON response
export type MetadataGroupType = {
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
    'mapbox:group': keyof MetadataGroupType
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
export type MbResponseType = {
  metadata: {
    'mapbox:groups': MetadataGroupType
  }
  layers: LayerPropsPlusMeta[]
}

export type LangFeatureType = {
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

export type MapEventType = Omit<PointerEvent, 'features'> & {
  features: LangFeatureType[]
}

export type LongLatType = {
  longitude: number
  latitude: number
}

export type MapPanelTypes = {
  active: boolean
  heading: string
  icon: React.ReactNode
  subheading: string
  summary?: string | React.ReactNode
  component?: React.ReactNode
}

export type MapPopupType = LongLatType & {
  selFeatAttribs: LangRecordSchema
}

export type MapTooltipType = LongLatType & {
  heading: string
  subHeading: string
}

export type MapComponent = {
  baselayer: BaselayerType
  symbLayers: LayerPropsNonBGlayer[]
  labelLayers?: LayerPropsNonBGlayer[]
}

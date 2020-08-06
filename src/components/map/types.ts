import { LayerProps, PointerEvent } from 'react-map-gl'
import * as mbGlFull from 'mapbox-gl'

import {
  LangRecordSchema,
  LayerVisibilityTypes,
  ActivePanelRouteType,
} from 'context/types'

// Assumes using Mapbox style
export type BaselayerType = 'dark' | 'light'

export type LayerToggleType = {
  name: string
  layerId: keyof LayerVisibilityTypes
}

// TODO: validate lat/long: -90 to 90, -180 to 180, zoom 1-20. Existing MB type?
export type InitialMapState = {
  latitude: number
  longitude: number
  zoom: number
  pitch?: number
  bearing?: number
}

export type LegendSwatchType = {
  backgroundColor?: string
  icon?: string
  shape?: 'circle' | 'square' | 'icon'
  size?: number
  text?: string
}

// MB Styles API individual group in the `metadata` of JSON response
export type MetadataGroupType = {
  [mbGroupIdHash: string]: {
    name: string
    collapsed: boolean // not needed but could be useful indirectly as a setting
  }
}

// `metadata` prop has MB Studio group ID and appears to only be part of the
// Style API, not the Style Spec.
export type LayerPropsPlusMeta = LayerProps & {
  metadata: {
    'mapbox:group': string
  }
  paint: mbGlFull.CirclePaint
  'source-layer': string
}

export type LayerComponentType = {
  styleUrl: string
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
  route: ActivePanelRouteType
  subheading: string
  summary?: string | React.ReactNode
  component?: React.ReactNode
}

import { LayerProps, PointerEvent } from 'react-map-gl'

import { LangRecordSchema, LayerVisibilityTypes } from 'context/types'

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
export interface LayerWithMetadata extends LayerProps {
  metadata: {
    'mapbox:group': string
  }
}

export type LayerComponentType = {
  styleUrl: string
}

export type MbResponseType = {
  metadata: {
    'mapbox:groups': MetadataGroupType
  }
  layers: LayerWithMetadata[]
}

export type LangFeatureType = {
  id: number
  layer: LayerWithMetadata
  properties: LangRecordSchema
  source: string
  sourceLayer: string
  type: 'Feature' | 'hmmmmmm'
  state: {
    alsoHmmmm: boolean
  }
}

export type MapClickType = Omit<PointerEvent, 'features'> & {
  features: LangFeatureType[]
}

export type PopupType = {
  heading: string
  longitude: number
  latitude: number
}

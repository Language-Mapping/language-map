import { LayerVisibilityTypes } from 'context/types'

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
  text?: string
}

// MB Styles API individual group in the `metadata` of JSON response
export type MetadataGroupType = {
  [mbGroupIdHash: string]: {
    name: string
    collapsed: boolean // not needed but could be useful indirectly as a setting
  }
}

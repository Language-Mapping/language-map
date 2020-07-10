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

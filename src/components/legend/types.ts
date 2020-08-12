export type LegendSwatch = {
  type: 'circle' | 'symbol'
  legendLabel: string
  backgroundColor?: string
  iconID?: string
  size?: number
}

// Same as the regular swatch but will have SVG element if it is a symbol
export type LegendSwatchComponent = LegendSwatch & {
  icon?: string
}

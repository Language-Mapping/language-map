import { WorldRegion } from '../../context/types'

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

export type LegendGroupConfig = {
  [key: string]: string[] | number[]
}

export type UNgeoscheme = 'Africa' | 'Americas' | 'Asia' | 'Europe' | 'Oceania'

export type LegendComponent = {
  legendItems: LegendSwatchComponent[]
  groupName: string
}

export type WorldRegionLegend = {
  [key in UNgeoscheme]: WorldRegion[]
}

export type GroupedLegendProps = LegendComponent & {
  groupConfig: LegendGroupConfig[]
}

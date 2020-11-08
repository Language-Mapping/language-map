import { WorldRegion, LangRecordSchema } from '../../context/types'

export type IconID =
  | '_tree'
  | '_book'
  | '_users'
  | '_home'
  | '_museum'
  | '_circle'

export type LegendSwatch = {
  legendLabel: string
  backgroundColor?: string
  iconID?: IconID
  size?: number
}

export type SwatchOnly = Pick<LegendSwatch, 'backgroundColor' | 'size'>

// Same as the regular swatch but will have SVG element if it is a symbol
export type LegendSwatchComponent = LegendSwatch & {
  icon?: string
  component?: React.ElementType
  labelStyleOverride?: React.CSSProperties
  to?: string
}

export type LegendPanelComponent = {
  legendItems: LegendSwatch[]
  groupName: string | keyof LangRecordSchema
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
  baseRoute: string
  groupConfig: LegendGroupConfig[]
}

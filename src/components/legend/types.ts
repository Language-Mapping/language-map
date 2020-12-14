import { WorldRegion, LangRecordSchema } from 'components/context/types'

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

export type LegendPanelProps = {
  activeGroupName: string | keyof LangRecordSchema
}

export type LegendGroupConfig = {
  name: string
  groupName: string
  'icon-image'?: string
  'icon-color'?: string
  'text-color'?: string
  'text-halo-color'?: string
}

// TODO: more generic, and combined w/above. Clean up all garbage once Airtable
// all-in w/the map.
export type WorldRegionFields = {
  name: string
  [key: string]: unknown
  continent?: string
  'icon-color'?: string
  'icon-image'?: IconID
  'icon-size'?: number
  src_img?: {
    url: string
  }[]
}

export type UNgeoscheme = 'Africa' | 'Americas' | 'Asia' | 'Europe' | 'Oceania'

export type LegendProps = {
  legendItems?: LegendSwatchComponent[]
  groupName: string
  url?: string
}

export type WorldRegionLegend = {
  [key in UNgeoscheme]: WorldRegion[]
}

export type GroupedLegendProps = LegendProps & {
  baseRoute: string
  groupConfig: LegendGroupConfig[]
  url?: string
}

export type Prepped = {
  [continent: string]: { 'icon-color': string; name: string }[]
}

export type AirtableRecord = {
  id: string
}

export type WorldRegionRecord = AirtableRecord & { fields: WorldRegionFields }

export type AirtableResponse = {
  records: AirtableRecord[]
}

export type LegendConfigItem = {
  fields?: string[]
  groupByField?: string
  labelByField?: string
  routeable?: boolean
}

export type LegendConfig = { [key: string]: LegendConfigItem }

export type PreppedLegend = {
  groupName: string
  items: WorldRegionFields[]
  routeName?: string
}

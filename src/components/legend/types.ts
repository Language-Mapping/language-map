import { WorldRegion, LangRecordSchema } from 'components/context/types'

export type IconID =
  | '_tree'
  | '_book'
  | '_users'
  | '_home'
  | '_museum'
  | '_circle'

export type LegendSwatchBareMin = {
  legendLabel: string
  backgroundColor?: string
  iconID?: IconID
  size?: number
}

export type SwatchOnlyProps = Pick<
  LegendSwatchBareMin,
  'backgroundColor' | 'size'
>

// Same as the regular swatch but will have SVG element if it is a symbol
export type LegendSwatchProps = LegendSwatchBareMin & {
  icon?: string
  component?: React.ElementType
  labelStyleOverride?: React.CSSProperties
  to?: string
}

export type LegendPanelProps = {
  activeGroupName: string | keyof LangRecordSchema
}

type UNgeoscheme = 'Africa' | 'Americas' | 'Asia' | 'Europe' | 'Oceania'

export type WorldRegionLegend = { [key in UNgeoscheme]: WorldRegion[] }

export type AtSchemaRecord = { id: string; fields: AtSchemaFields }
export type AtSymbRecord = { id: string; fields: AtSymbFields }

export type AtSymbFields = {
  name: string
  continent?: string
  'icon-color'?: string
  'icon-image'?: IconID
  'icon-size'?: number
  'text-color'?: string
  'text-halo-color'?: string
  src_img?: { url: string }[]
}

export type LegendGroupConfig = AtSymbFields & { groupName: string }

// Columns from Schema table, or at least a few of them
export type AtSchemaFields = {
  name: string
  groupByField?: keyof AtSymbFields
  labelByField?: keyof AtSymbFields
  sortByField?: keyof AtSymbFields
  legendHeading?: string
  legendSummary?: string
  sourceCredits?: string
  routeable?: boolean
  queryFields?: Array<keyof AtSymbFields>
  // Not using this but super handy for future reference. Rm when memorized:
  // CRED: https://stackoverflow.com/a/51808262/1048518
  // queryFields?: Array<Extract<keyof AtSymbFields, string>> // NOYCE
}

export type LegendProps = {
  groupName: string
  items: AtSymbFields[]
  legendSummary?: string
  sourceCredits?: string
  routeName?: string // may differ from "groupName" if custom heading exists
}

export type FinalPrep = (
  rows: AtSymbFields[],
  labelByField?: keyof AtSymbFields,
  sortByField?: 'name' | keyof AtSymbFields
) => AtSymbFields[]

export type UseLegendConfig = (
  tableName: string
) => {
  data: LegendProps[]
  isLoading: boolean
  error?: unknown
} & Omit<AtSchemaFields, 'name'>

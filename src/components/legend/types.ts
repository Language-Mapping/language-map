type IconID = '_tree' | '_book' | '_users' | '_home' | '_museum' | '_circle'

type LegendSwatchBareMin = {
  legendLabel: string
  backgroundColor?: string
  iconID?: IconID
  size?: number
}

export type LangTypeIconsConfig = { icon: string; id: IconID }
export type AtSchemaRecord = { id: string; fields: AtSchemaFields }
export type AtSymbRecord = { id: string; fields: AtSymbFields }

export type SwatchOnlyProps = Pick<
  LegendSwatchBareMin,
  'backgroundColor' | 'size'
>

// Same as the regular swatch but will have SVG element if it is a symbol
export type LegendSwatchProps = LegendSwatchBareMin & {
  icon?: string
  // definition?: string // TODO: do it right (no dual-purpose Airtable columns)
  component?: React.ElementType
  labelStyleOverride?: React.CSSProperties
  to?: string
}

export type AtSymbFields = {
  name: string
  continent?: string
  languages?: string[] // not used for symbology, just mid-level Explore
  'icon-color'?: string
  'icon-image'?: IconID
  'icon-size'?: number
  'text-color'?: string
  'text-halo-color'?: string
  src_image?: { url: string }[]
}

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

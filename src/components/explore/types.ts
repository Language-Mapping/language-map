import { DetailsSchema, LangRecordSchema } from 'components/context/types'
import { AtSymbFields } from 'components/legend/types'

// TODO: try to reuse some of these, they're pretty common in sev. components
export type CategoryProps = {
  title: string
  uniqueInstances?: unknown[]
  url: string
  footer?: string | React.ReactNode
  icon?: React.ReactNode
  intro?: string
}

export type CustomCardProps = CategoryProps & {
  footerIcon?: React.ReactNode
}

export type CategoryConfig = {
  name: keyof LangRecordSchema
  definition?: string
  icon?: React.ReactNode
  parse?: boolean
}

// /Explore/:field/:value/:language
export type RouteMatch = {
  field: keyof DetailsSchema
  value?: string
  language?: string
}

export type CardConfig = CategoryProps & {
  footer: string
  to: string
}

export type SwatchOrFlagOrIcon = {
  field: keyof DetailsSchema
  value?: string
}

export type CensusPopoverProps = {
  data: DetailsSchema
}

export type StatsAndMetaProps = { data: Partial<DetailsSchema> }

export type CurrentCrumbProps = {
  value: string
  basePath: string
}

export type MidLevelExploreProps = {
  tableName?: keyof DetailsSchema
  sortByField?: string
}

export type AirtableOptions = {
  // fields?: Array<Extract<keyof LangRecordSchema, string>> // REFACTOR
  fields?: string[]
  filterByFormula?: string
  maxRecords?: number
  sort?: { field: string; direction?: 'asc' | 'desc' }[]
}

type SchemaTableFields = {
  name: string
  plural?: string
  definition?: string
  legendHeading?: string
  exploreSortOrder?: number
  routeable?: boolean
  symbolizeable?: boolean
  includeInTable?: boolean
}

export type TonsOfFields = DetailsSchema & AtSymbFields & SchemaTableFields
export type TonsWithAddl = TonsOfFields & { 'Additional Languages'?: string[] }
export type AirtableError = {
  error: string // error type, e.g. UNKNOWN_FIELD_NAME
  message: string
  statusCode: number
}

// TODO: figure it out
// export type UseAirtable<TResult> = (
//   tableName: string,
//   options: AirtableOptions,
//   reactQueryOptions?: { enabled?: boolean } // TODO: ugh
// ) => {
//   data: TResult[]
//   error: AirtableError | null
//   isLoading: boolean
// }

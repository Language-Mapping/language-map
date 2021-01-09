import {
  DetailsSchema,
  LangRecordSchema,
  RouteableTableNames,
} from 'components/context/types'
import { AtSymbFields } from 'components/legend/types'

export type ReactQueryOptions = {
  enabled?: boolean
  refetchOnMount?: boolean
  refetchOnReconnect?: boolean
  refetchOnWindowFocus?: boolean
}

// TODO: try to reuse some of these, they're pretty common in sev. components
type CategoryProps = {
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

// TODO: rename to `tableName` or something, since "field" no longer applies
// /Explore/:field/:value/:language
export type RouteMatch = {
  field: RouteableTableNames
  value?: string
  language?: string
}

export type CardConfig = CategoryProps & {
  footer: string
  to: string
}

export type SwatchOrFlagOrIcon = {
  field: RouteableTableNames // TODO: de-fragilize
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
  tableName?: RouteableTableNames
  sortByField?: string
}

export type AirtableOptions = {
  // fields?: Array<Extract<keyof LangRecordSchema, string>> // REFACTOR
  fields?: string[]
  filterByFormula?: string
  maxRecords?: number
  sort?: { field: string; direction?: 'asc' | 'desc' }[]
  baseID?: string // API base identifier
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

// Details' current crumb fields which come back from Airtable
export type CrumbResponse = Pick<DetailsSchema, 'Language' | 'Primary Location'>

export type ExploreIcon = {
  [key in RouteableTableNames]: React.ReactNode
}

export type AirtableSchemaQuery = SchemaTableFields & {
  name: RouteableTableNames
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

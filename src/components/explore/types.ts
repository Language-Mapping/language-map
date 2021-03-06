import {
  InstanceLevelSchema,
  LangLevelSchema,
  RouteableTableNames,
} from 'components/context/types'
import { AtSymbFields } from 'components/legend/types'

export type ReactQueryOptions = {
  enabled?: boolean
  refetchOnMount?: boolean
  refetchOnReconnect?: boolean
  refetchOnWindowFocus?: boolean
}

// TODO: detangle this mess like a professional web developer, reuse existing
export type BasicExploreIntroProps = {
  extree?: string | React.ReactNode // catch-all stuff for intro bottom
  icon?: React.ReactNode
  introParagraph?: string | React.ReactNode
  expand?: boolean
  noAppear?: boolean // way around it after the first load
  subSubtitle?: string | React.ReactNode
  subtitle?: string | React.ReactNode
  title?: string
}

// TODO: try to reuse some of these, they're pretty common in sev. components
export type CustomCardProps = {
  title: string
  uniqueInstances?: unknown[]
  url: string
  footer?: string | React.ReactNode
  icon?: React.ReactNode
  intro?: string
  timeout?: number
  noAnimate?: boolean
}

export type CategoryConfig = {
  name: keyof InstanceLevelSchema
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

export type CardConfig = CustomCardProps & {
  footer: string
  to: string
}

export type SwatchOrFlagOrIcon = {
  field: RouteableTableNames // TODO: de-fragilize
  value?: string
}

export type CensusPopoverProps = {
  data: Pick<
    LangLevelSchema,
    'censusPretty' | 'censusScope' | 'censusField' | 'name'
  > &
    Pick<InstanceLevelSchema, 'Language'>
}

export type StatsAndMetaProps = { data: Partial<LangLevelSchema> }

export type CurrentCrumbProps = {
  value: string
  basePath: string
}

export type MidLevelExploreProps = {
  tableName?: RouteableTableNames
  sortByField?: string
}

export type AirtableOptions = {
  // fields?: Array<Extract<keyof InstanceLevelSchema, string>> // REFACTOR
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

export type TonsOfFields = InstanceLevelSchema &
  AtSymbFields &
  SchemaTableFields
export type TonsWithAddl = TonsOfFields & { 'Additional Languages'?: string[] }
export type AirtableError = {
  error: string // error type, e.g. UNKNOWN_FIELD_NAME
  message: string
  statusCode: number
}

// Details' current crumb fields which come back from Airtable
export type CrumbResponse = Pick<
  InstanceLevelSchema,
  'Language' | 'Primary Location'
>

export type ExploreIcon = {
  [key in RouteableTableNames]: React.ReactNode
}

export type AirtableSchemaQuery = SchemaTableFields & {
  name: RouteableTableNames
}

// TODO: ellipsis for the monsters...
// export type PanelIntroTitleProps = {
//   tooLong?: boolean
// }

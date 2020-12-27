import { DetailsSchema } from 'components/context'

import { LangRecordSchema } from 'components/context/types'

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

export type LangFilterArgs = RouteMatch & {
  langFeatures: LangRecordSchema[]
}

export type CensusPopoverProps = {
  data: DetailsSchema
}

export type StatsAndMetaProps = {
  iso?: string
  glotto?: string
  speakers?: string // string if from Sheets API, number if from MB
}

export type CurrentCrumbProps = {
  value: string
  basePath: string
}

export type MidLevelExploreProps = {
  tableName?: keyof DetailsSchema
  sortByField?: string
}

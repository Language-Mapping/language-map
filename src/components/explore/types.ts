import { LangRecordSchema } from 'components/context/types'

// TODO: try to reuse some of these, they're pretty common in sev. components
export type CategoryProps = {
  intro: string
  title: string
  url: string
  footer?: string
  icon?: React.ReactNode
  uniqueInstances?: unknown[]
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
  field: keyof LangRecordSchema
  value?: string
  language?: string
}

export type CardConfig = {
  footer: string
  intro: string
  title: string
  to: string
  icon?: React.ReactNode
}

export type SwatchOrFlagOrIcon = {
  field: keyof LangRecordSchema
  value?: string
}

export type ExploreSubViewProps = {
  instancesCount: number
  subtitle?: string
  subSubtitle?: string | React.ReactNode
  extree?: string | React.ReactNode
}

export type LangFilterArgs = RouteMatch & {
  langFeatures: LangRecordSchema[]
}

export type CensusPopoverProps = {
  language: string
  tractField?: string
  pumaField?: string
  censusPretty?: string
}

export type StatsAndMetaProps = {
  iso?: string
  glotto?: string
  speakers?: string // string if from Sheets API, number if from MB
}

import { LangRecordSchema } from '../../context/types'

export type CategoryProps = {
  intro: string
  title: string
  url: string
  footer?: string
  uniqueInstances?: unknown[]
  icon?: React.ReactNode
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
  title: string
  intro: string
  footer: string
  to: string
  icon?: React.ReactNode
}

export type SwatchOrFlagOrIcon = {
  field: keyof LangRecordSchema
  value?: string
}

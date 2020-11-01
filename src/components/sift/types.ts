import { LangRecordSchema } from '../../context/types'

export type CategoryProps = {
  intro: string
  title: string
  url: string
  subtitle: string
  uniqueInstances: unknown[]
  icon?: React.ReactNode
}

export type CategoryConfig = {
  name: keyof LangRecordSchema
  definition: string
  icon?: React.ReactNode
  parse?: boolean
}

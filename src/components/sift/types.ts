import { LangRecordSchema } from '../../context/types'

export type CategoryProps = {
  name: keyof LangRecordSchema
  url: string
  summary: string
  uniqueInstances: unknown[]
}

export type CategoryConfig = Omit<CategoryProps, 'url'> & {
  parse?: boolean
}

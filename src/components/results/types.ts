import { LangRecordSchema } from '../../context/types'

export type ColumnsConfig = {
  title: keyof LangRecordSchema
  field: keyof LangRecordSchema
}

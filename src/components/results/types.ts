import { Options, Column } from 'material-table'

import { LangRecordSchema } from '../../context/types'

export type ColumnsConfig = Column<LangRecordSchema> & {
  title: keyof LangRecordSchema
  field: keyof LangRecordSchema
}

export type TableOptions = Options<LangRecordSchema>

import MaterialTable, { Options, Column } from 'material-table'

import { LangRecordSchema } from '../../context/types'

export type ColumnsConfig = Column<LangRecordSchema> & {
  title: keyof LangRecordSchema
  field: keyof LangRecordSchema
}

export type TableOptions = Options<LangRecordSchema>

// `dataManager` prop definitely exists but is not evidently part of the TS
export type MuiTableWithDataMgr = MaterialTable<LangRecordSchema> & {
  dataManager: {
    filteredData: LangRecordSchema[]
  }
}

// The JSON file with {"name":"code"} country key/val pairs
export type CountryCodes = {
  [key: string]: string
}

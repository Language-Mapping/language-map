import MaterialTable, { Options, Column } from 'material-table'

import { LangRecordSchema } from '../../context/types'

export type FilterComponentProps = {
  columnDef: {
    tableData: { id: number | string; filterValue: boolean }
  } & Column<LangRecordSchema>
  onFilterChanged: (rowId: number | string, value: string) => void
}

export type ColumnsConfig = Column<LangRecordSchema> & {
  title: keyof LangRecordSchema
  field: keyof LangRecordSchema
}

export type TableOptions = Options<LangRecordSchema>

// `dataManager` prop definitely exists but is not evidently part of the TS
export type MuiTableWithLangs = MaterialTable<LangRecordSchema>

// The JSON file with {"name":"code"} country key/val pairs
export type CountryCodes = {
  [key: string]: string
}

export type CloseTableProps = {
  closeTable: () => void
}

export type ResultsTableProps = CloseTableProps & {
  data: LangRecordSchema[]
}

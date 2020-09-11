import MaterialTable, {
  Options,
  Column,
  MaterialTableProps,
} from 'material-table'

import { LangRecordSchema } from '../../context/types'

export type TableData = { id: number | string; filterValue: boolean }

export type FilterComponentProps = {
  columnDef: {
    tableData: TableData
  } & Column<LangRecordSchema>
  onFilterChanged: (rowId: number | string, value: string) => void
}

export type ColumnsConfig = Column<LangRecordSchema> & {
  title: keyof LangRecordSchema
  field: keyof LangRecordSchema
}

export type ColumnWithTableData = { tableData: TableData } & ColumnsConfig

export type TableOptions = Options<LangRecordSchema>

// `dataManager` prop definitely exists but is not evidently part of the TS
export type MuiTableWithLangs = MaterialTable<LangRecordSchema> & {
  dataManager: {
    data: LangRecordSchema[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    changeFilterValue: (col: number, val: any) => void
    getRenderState: () => Omit<
      MaterialTableProps<LangRecordSchema>,
      'columns'
    > & {
      columns: ColumnWithTableData[]
    }
  }
}

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

import MaterialTable, {
  Options,
  Column,
  MaterialTableProps,
} from 'material-table'

import { LangRecordSchema } from '../../context/types'

// The JSON file with {"name":"code"} country key/val pairs
export type CountryCodes = { [key: string]: string }
export type CloseTableProps = { closeTable: () => void }
export type ColumnWithTableData = { tableData: TableData } & ColumnsConfig
export type ResultsTableProps = CloseTableProps & { data: LangRecordSchema[] }
export type TableOptions = Options<LangRecordSchema>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TableData = { id: number | string; filterValue: any }

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

// `dataManager` prop definitely exists but is not evidently part of the TS
export type MuiTableWithLangs = MaterialTable<LangRecordSchema> & {
  dataManager: {
    data: LangRecordSchema[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    changeFilterValue: (col: number, val: any) => void
    changeSearchText: (text: string) => void
    getRenderState: () => Omit<
      MaterialTableProps<LangRecordSchema>,
      'columns'
    > & {
      columns: ColumnWithTableData[]
      query: {
        searchText: string
      }
    }
  }
}

export type ResultsToolbarProps = MaterialTableProps<LangRecordSchema> & {
  scrollToTop: () => void
  tableRef: React.RefObject<MuiTableWithLangs>
  clearBtnEnabled: boolean
  setClearBtnEnabled: React.Dispatch<boolean>
} & CloseTableProps

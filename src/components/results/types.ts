import MaterialTable, {
  Options,
  Column,
  MaterialTableProps,
} from 'material-table'

import { LangRecordSchema } from 'components/context/types'
import { AirtableError } from 'components/explore/types'

type ColumnWithField = Column<LangRecordSchema> & {
  field: keyof LangRecordSchema
  title: string
}

export type ColumnList = ColumnWithField[]
export type InitialData = LangRecordSchema[]

// The JSON file with {"name":"code"} country key/val pairs
export type CountryCodes = { [key: string]: string }
export type ColumnWithTableData = { tableData: TableData } & ColumnsConfig
export type ResultsTableProps = { data: LangRecordSchema[] }
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

type HistoryState = null | {
  selFeatID?: number
  // TODO: scroll tops:
  // scrollTops?: {
  //   [key in RouteLocation]?: string
  // }
}

export type UseLocation = {
  state: HistoryState
  pathname: string
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
}

export type CountryListItemWithFlagProps = {
  name: string
  url: string
  filterClassName: string
}

export type DescripResponse = { Description: string }
export type DescripsTableName = 'Descriptions' | 'Language Descriptions'
export type UseDescription = {
  data: DescripResponse[]
  error: AirtableError | null
  isLoading: boolean
}

export type RecordDescriptionProps = {
  descripTable: DescripsTableName
  descriptionID: string
}

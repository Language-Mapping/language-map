import {
  GridColDef,
  GridFilterItem,
  GridRenderCellParams,
} from '@mui/x-data-grid'

import { InstanceLevelSchema } from 'components/context/types'
import { AirtableError } from 'components/explore/types'

export type LangColumn = GridColDef<InstanceLevelSchema> & {
  field: keyof InstanceLevelSchema | 'actions-id' | 'actions-county'
  title: string | React.ReactElement
  hidden?: boolean
  export?: boolean
  lookup?: { [key: string]: string }
}

export type ColumnList = LangColumn[]
export type InitialData = InstanceLevelSchema[]

export type CountryCodes = { [key: string]: string }
export type ResultsTableProps = { data: InstanceLevelSchema[] }

export type ResultsToolbarProps = {
  scrollToTop: () => void
  clearBtnEnabled: boolean
  setClearBtnEnabled: React.Dispatch<boolean>
}

export type FilterComponentProps = {
  item: GridFilterItem
  applyValue: (item: GridFilterItem) => void
}

export type UseLocation = {
  state: null | {
    selFeatID?: number
  }
  pathname: string
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

export type CellProps = {
  data: InstanceLevelSchema
}

export type MediaColumnCellProps = CellProps & {
  columnName: keyof InstanceLevelSchema
}

export type LangCellParams = GridRenderCellParams<InstanceLevelSchema>

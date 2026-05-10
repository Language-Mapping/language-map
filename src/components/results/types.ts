import { CellContext, ColumnDef, FilterFn, Row } from '@tanstack/react-table'

import { InstanceLevelSchema } from 'components/context/types'
import { AirtableError } from 'components/explore/types'

export type LangColumnMeta = {
  // Human-readable column title for export (PDF/CSV) and filter labels.
  exportTitle?: string | React.ReactElement
  // If true, exclude from CSV/PDF export.
  excludeFromExport?: boolean
  // Predefined value set, used to render a select dropdown filter.
  lookup?: { [key: string]: string }
  // Render a "has media" checkbox filter instead of the default text input.
  mediaFilter?: boolean
  // Hide the per-column filter input.
  unfilterable?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type LangColumn = ColumnDef<InstanceLevelSchema, any> & {
  meta?: LangColumnMeta
}

export type ColumnList = LangColumn[]
export type InitialData = InstanceLevelSchema[]

// Used by exporting.ts after filtering out export-excluded columns.
export type ExportableColumn = LangColumn & {
  accessorKey: keyof InstanceLevelSchema
  header: string | React.ReactElement
}

export type CountryCodes = { [key: string]: string }
export type ResultsTableProps = { data: InstanceLevelSchema[] }

export type UseLocation = {
  state: null | {
    selFeatID?: number
  }
  pathname: string
}

export type LangCellContext = CellContext<InstanceLevelSchema, unknown>
export type LangRow = Row<InstanceLevelSchema>
export type LangFilterFn = FilterFn<InstanceLevelSchema>

export type ColumnToggle = {
  id: string
  label: string
  isVisible: boolean
  canHide: boolean
  toggle: () => void
}

export type ResultsToolbarProps = {
  scrollToTop: () => void
  clearBtnEnabled: boolean
  setClearBtnEnabled: React.Dispatch<boolean>
  visibleRows: InstanceLevelSchema[]
  globalFilter: string
  setGlobalFilter: (v: string) => void
  resetFilters: () => void
  rowCount: number
  columns: ColumnList
  columnToggles: ColumnToggle[]
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

/* eslint-disable react/display-name */
import React from 'react'
import { Icons, Localization } from 'material-table'
import { FaFilter } from 'react-icons/fa'
import {
  MdArrowUpward,
  MdCheck,
  MdChevronLeft,
  MdChevronRight,
  MdClear,
  MdFileDownload,
  MdFirstPage,
  MdLastPage,
  MdSearch,
  MdViewColumn,
  MdRemove,
} from 'react-icons/md'

import * as Types from './types'
import * as utils from './utils'
import * as Cells from './Cells'

import { Statuses } from '../../context/types'
import { VideoColumnFilter } from './VideoColumnFilter'
import { LocalColumnTitle } from './LocalColumnTitle'

const COMM_STATUS_LOOKUP = {
  Community: 'Community',
  Historical: 'Historical',
  Liturgical: 'Liturgical',
  Residential: 'Residential',
  Reviving: 'Reviving',
} as {
  [key in Statuses]: Statuses
}

// TODO: pass this as fn arg instead of importing in export util
export const tableExportMeta = {
  pageTitle: 'Languages of New York City',
  filename: 'nyc-language-data',
  fullDatasetURL:
    'https://docs.google.com/spreadsheets/d/1CZLDDyxNM3euikks8NJfKt3ajNXToVGbwEObSOJkbfA/edit',
}

// TODO: TS it up
export const COMM_SIZE_COL_MAP = {
  1: 'Smallest',
  2: 'Small',
  3: 'Medium',
  4: 'Large',
  5: 'Largest',
}

export const localization: Localization = {
  body: {
    emptyDataSourceMessage:
      'No communities found. Try fewer criteria or click the "Clear filters" button to reset the table.',
  },
  header: {
    actions: '',
  },
  toolbar: {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore // in newer version of material-table, which has laggy bug...
    exportCSVName: 'Download as CSV',
    exportPDFName: 'Download as PDF',
    searchPlaceholder: 'Search...',
  },
}

// Table options for the <MaterialTable> component
export const options = {
  columnsButton: true,
  doubleHorizontalScroll: false,
  draggable: true, // kinda clunky
  exportAllData: true, // misleading, it actually exports all FILTERED data
  exportButton: true, // enable it in the toolbar
  filtering: true,
  grouping: false, // kinda clunky
  isLoading: true,
  maxBodyHeight: '100%',
  minBodyHeight: '100%',
  pageSize: 20,
  pageSizeOptions: [10, 20, 50],
  searchFieldAlignment: 'left',
  showTitle: false,
  thirdSortClick: false,
  // TODO: rm unused, or keep for reference
  // actionsCellStyle: {}, // semi-useful but ended up with `!important` anyway
  // actionsColumnIndex: 0,
  // fixedColumns: { left: 2, right: 0 }, // awful in so many ways
  // headerStyle: { position: 'sticky', top: 0 },
  // filterCellStyle: { backgroundColor: 'yellow' }, // works
  // filterRowStyle: { backgroundColor: 'red' }, // works, but sticky 2 tricky!
  // padding: 'dense', // dense leads to choppier inconsistent row height
  // rowStyle: { backgroundColor: 'turquoise' }, // works
  // searchFieldVariant: 'outlined', // meh, too big
  // searchFieldStyle: {}, // the actual text inside search box
  // tableLayout: 'fixed', // can set widths, but `fixed` = for bad Actions col
} as Types.TableOptions

export const icons = {
  Check: MdCheck,
  DetailPanel: MdChevronRight,
  Export: MdFileDownload,
  Filter: FaFilter,
  FirstPage: MdFirstPage,
  LastPage: MdLastPage,
  NextPage: MdChevronRight,
  PreviousPage: MdChevronLeft,
  ResetSearch: MdClear,
  Search: MdSearch,
  SortArrow: MdArrowUpward,
  ThirdStateCheck: MdRemove,
  ViewColumn: MdViewColumn,
} as Icons

const commonColProps = {
  editable: 'never',
  searchable: true,
  // cellStyle: {},
}

const hiddenCols = [
  {
    title: 'Glottocode',
    field: 'Glottocode',
    ...commonColProps,
    hidden: true,
  },
  {
    title: 'ISO 639-3',
    field: 'ISO 639-3',
    ...commonColProps,
    hidden: true,
  },
]

// NOTE: did not want to attempt to deal with any of the multi-option cols like
// Size or Status in terms of filter-col-via-cell-click behavior, or the
// boolean-ish Video column. Wishlist...

// 25px : 200char = decent ratio
export const columns = [
  {
    title: '',
    field: 'ID',
    ...commonColProps,
    filtering: false,
    export: false,
    render: utils.renderIDcolumn,
  },
  {
    title: '',
    field: 'Description',
    ...commonColProps,
    sorting: false,
    filtering: false,
    export: false,
    render: utils.renderDescripCol,
  },
  {
    // Average: 9.3, Longest: 31
    title: 'Language',
    field: 'Language',
    ...commonColProps,
    defaultSort: 'asc',
  },
  {
    // Average: 8.5, Longest: 26, Longest full: Anashinaabemowin
    title: 'Endonym',
    field: 'Endonym',
    ...commonColProps,
    render: utils.renderEndoColumn,
  },
  {
    // Average: 13, Longest: 25 (thanks AUS & NZ...)
    title: 'World Region',
    field: 'World Region',
    ...commonColProps,
    // TODO: instead of open-search filters, custom `filterComponent` with this:
    // https://material-ui.com/components/autocomplete/#checkboxes
    render: (data) => <Cells.WorldRegion data={data} />,
    headerStyle: {
      paddingRight: 25, // enough for `Southeastern Asia` cells to not wrap
      whiteSpace: 'nowrap',
    },
  },
  {
    // Average: 8.5, Longest: 35 (w/o big Congos: Average: 8, Longest: 24)
    // ...plus emoji flag and margin
    // TODO: for Countries selection:
    // https://material-ui.com/components/autocomplete/#country-select
    title: 'Countries',
    field: 'Countries',
    ...commonColProps,
    render: utils.renderCountriesColumn,
    headerStyle: {
      paddingRight: 25, // enough for `United States` cells to not wrap
    },
  },
  {
    // Longest: 20
    title: 'Global Speakers', // the only abbrev so far
    field: 'Global Speaker Total',
    ...commonColProps,
    // customSort: utils.sortNeighbs, // TODO: blanks last
    render: (data) => <Cells.GlobalSpeakers data={data} />,
    searchable: false,
    filtering: false,
    disableClick: true,
    type: 'numeric',
    // Right-aligned number w/left-aligned column heading was requested
    headerStyle: {
      whiteSpace: 'nowrap',
      paddingRight: 0,
      flexDirection: 'row',
    },
  },
  {
    // Average: 10, Longest: 23 but preserve hyphenated Athabaskan-Eyak-Tlingit
    title: 'Language Family',
    field: 'Language Family',
    ...commonColProps,
    headerStyle: { whiteSpace: 'nowrap' },
  },
  {
    // Average: 12, Longest: 26
    title: <LocalColumnTitle text="Neighborhoods" />,
    field: 'Neighborhoods',
    ...commonColProps,
    render: utils.renderNeighbColumn,
    customSort: utils.sortNeighbs,
  },
  {
    // Longest: 14
    title: <LocalColumnTitle text="Size" />,
    field: 'Size',
    ...commonColProps,
    align: 'left',
    lookup: COMM_SIZE_COL_MAP,
    disableClick: true,
    customSort: (a, b) => {
      if (a.Size === b.Size) return 0
      if (a.Size > b.Size) return 1

      return -1
    },
    render: (data) => <Cells.CommSize data={data} lookup={COMM_SIZE_COL_MAP} />,
    searchable: false,
    headerStyle: {
      paddingRight: 25, // "Smallest" is ironically the longest
    },
  },
  {
    // Longest: 13
    title: <LocalColumnTitle text="Status" />,
    field: 'Status',
    ...commonColProps,
    disableClick: true,
    searchable: false,
    render: (data) => <Cells.CommStatus data={data} />,
    lookup: COMM_STATUS_LOOKUP,
  },
  {
    title: 'Video',
    field: 'Video',
    ...commonColProps,
    export: false,
    filterComponent: VideoColumnFilter,
    headerStyle: { whiteSpace: 'nowrap' },
    render: (data) => <Cells.VideoColumnCell data={data} />,
    searchable: false,
    disableClick: true,
  },
  ...hiddenCols,
] as Types.ColumnsConfig[]

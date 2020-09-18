import React from 'react'
import { Icons, Localization } from 'material-table'
import { FaFilter } from 'react-icons/fa'
import {
  MdArrowUpward,
  MdCheck,
  MdChevronLeft,
  MdChevronRight,
  MdClear,
  MdFirstPage,
  MdLastPage,
  MdSearch,
  MdViewColumn,
  MdRemove,
} from 'react-icons/md'

import * as Types from './types'
import * as utils from './utils'

import { RenderWorldRegionColumn, RenderCommSizeColumn } from './utils'
import { Statuses } from '../../context/types'
import { VideoColumnFilter } from './VideoColumnFilter'
import { VideoColumnCell } from './VideoColumnCell'
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
    searchPlaceholder: 'Search...',
  },
}

// Table options for the <MaterialTable> component
export const options = {
  actionsColumnIndex: 0,
  columnsButton: true,
  doubleHorizontalScroll: true,
  draggable: true, // kinda clunky
  filtering: true,
  grouping: false, // kinda clunky
  isLoading: true,
  pageSize: 10,
  pageSizeOptions: [5, 10, 20, 50],
  searchFieldAlignment: 'left',
  showTitle: false,
  thirdSortClick: false,
  // TODO: rm unused, or keep for reference
  // actionsCellStyle: {}, // semi-useful but ended up with `!important` anyway
  // headerStyle: { position: 'sticky', top: 0 },
  // filterCellStyle: { backgroundColor: 'yellow' }, // works
  // filterRowStyle: { backgroundColor: 'red' }, // works, but sticky 2 tricky!
  // fixedColumns: { left: 1 }, // useless if using Actions
  // padding: 'dense', // dense leads to choppier inconsistent row height
  // rowStyle: { backgroundColor: 'turquoise' }, // works
  // searchFieldVariant: 'outlined', // meh, too big
  // searchFieldStyle: {}, // the actual text inside search box
  // tableLayout: 'fixed', // can set widths, but `fixed` = for bad Actions col
} as Types.TableOptions

export const icons = {
  Check: MdCheck,
  DetailPanel: MdChevronRight,
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

// TODO: "IMLocation looks good if you need something to replace the asterisk
// next to local items in the table. For Data Table & Filter, I’d probably use
// that same three-bullet list you have next to Data. And for turning off the
// filter, how about RIFilterOffFill?"

// 25px : 200char = decent ratio
export const columns = [
  {
    // Average: 9.3, Longest: 31
    title: 'Language',
    field: 'Language',
    editable: 'never',
    export: false,
    defaultSort: 'asc',
    searchable: true,
  },
  {
    // Average: 8.5, Longest: 26, Longest full: Anashinaabemowin
    title: 'Endonym',
    field: 'Endonym',
    editable: 'never',
    export: false,
    disableClick: true, // TODO: use this if we want row clicks again
    render: utils.renderEndoColumn,
    searchable: true,
  },
  {
    // Average: 13, Longest: 25 (thanks AUS & NZ...)
    title: 'World Region',
    field: 'World Region',
    editable: 'never',
    export: false,
    // TODO: instead of open-search filters, custom `filterComponent` with this:
    // https://material-ui.com/components/autocomplete/#checkboxes
    // eslint-disable-next-line react/display-name
    render: (data) => <RenderWorldRegionColumn data={data} />,
    searchable: true,
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
    editable: 'never',
    export: false,
    render: utils.renderCountriesColumn,
    searchable: true,
    headerStyle: {
      paddingRight: 25, // enough for `United States` cells to not wrap
    },
  },
  {
    // Longest: 20
    title: 'Global Speakers', // the only abbrev so far
    field: 'Global Speaker Total',
    editable: 'never',
    export: false,
    // defaultSort: 'asc', // TODO: make this work
    // customSort: utils.sortNeighbs, // TODO: blanks last
    render: utils.renderGlobalSpeakColumn,
    searchable: false,
    filtering: false,
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
    editable: 'never',
    export: false,
    searchable: true,
    headerStyle: {
      whiteSpace: 'nowrap',
    },
  },
  {
    // Average: 12, Longest: 26
    title: <LocalColumnTitle text="Neighborhoods" />,
    field: 'Neighborhoods',
    editable: 'never',
    export: false,
    searchable: true,
    render: utils.renderNeighbColumn,
    customSort: utils.sortNeighbs,
  },
  {
    // Longest: 14
    title: <LocalColumnTitle text="Size" />,
    field: 'Size',
    editable: 'never',
    export: false,
    align: 'left',
    lookup: COMM_SIZE_COL_MAP,
    customSort: (a, b) => {
      if (a.Size === b.Size) return 0
      if (a.Size > b.Size) return 1

      return -1
    },
    // eslint-disable-next-line react/display-name
    render: (data) => (
      <RenderCommSizeColumn data={data} lookup={COMM_SIZE_COL_MAP} />
    ),
    searchable: false,
  },
  {
    // Longest: 13
    title: <LocalColumnTitle text="Status" />,
    field: 'Status',
    editable: 'never',
    export: false,
    searchable: false,
    lookup: COMM_STATUS_LOOKUP,
  },
  {
    title: 'Video',
    field: 'Video',
    editable: 'never',
    export: false,
    filterComponent: VideoColumnFilter,
    headerStyle: { whiteSpace: 'nowrap' },
    render: VideoColumnCell,
    searchable: false,
  },
  // All hidden from here down
  {
    title: 'Description',
    field: 'Description',
    editable: 'never',
    export: false,
    hidden: true,
    searchable: true,
  },
  {
    title: 'Glottocode',
    field: 'Glottocode',
    editable: 'never',
    export: false,
    hidden: true,
    searchable: true,
  },
  {
    title: 'ISO 639-3',
    field: 'ISO 639-3',
    editable: 'never',
    export: false,
    hidden: true,
    searchable: true,
  },
] as Types.ColumnsConfig[]

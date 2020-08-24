import { Icons, Localization } from 'material-table'
import { FaFilter } from 'react-icons/fa'
import {
  MdSearch,
  MdClear,
  MdChevronLeft,
  MdChevronRight,
  MdLastPage,
  MdFirstPage,
  MdArrowUpward,
  MdViewColumn,
} from 'react-icons/md'

import * as Types from './types'
import * as utils from './utils'

export const COMM_SIZE_COL_MAP = {
  1: 'Smallest',
  2: 'Small',
  3: 'Medium',
  4: 'Large',
  5: 'Largest',
}

export const localization: Localization = {
  header: {
    actions: '',
  },
  toolbar: {
    searchPlaceholder: 'Search data...',
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
  // searchFieldStyle: {}, // TODO: rm if not using
  search: true,
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
  // tableLayout: 'fixed', // can set widths, but `fixed` = for bad Actions col
} as Types.TableOptions

export const icons = {
  DetailPanel: MdChevronRight,
  Filter: FaFilter,
  FirstPage: MdFirstPage,
  LastPage: MdLastPage,
  NextPage: MdChevronRight,
  PreviousPage: MdChevronLeft,
  ResetSearch: MdClear,
  Search: MdSearch,
  SortArrow: MdArrowUpward,
  ViewColumn: MdViewColumn,
} as Icons

// 25px : 200char = decent ratio
export const columns = [
  {
    // Average: 9.3, Longest: 31
    title: 'Language',
    field: 'Language',
    defaultSort: 'asc',
    editable: 'never',
    searchable: true,
  },
  {
    // Average: 8.5, Longest: 26, Longest full: Anashinaabemowin
    title: 'Endonym',
    field: 'Endonym',
    editable: 'never',
    disableClick: true, // TODO: use this if we want row clicks again
    render: utils.renderEndoColumn,
    searchable: true,
  },
  {
    // Average: 13, Longest: 25 (thanks AUS & NZ...)
    title: 'World Region',
    field: 'World Region',
    editable: 'never',
    render: utils.renderWorldRegionColumn,
    searchable: true,
    headerStyle: {
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
    render: utils.renderGlobalSpeakColumn,
    searchable: false,
    type: 'numeric',
    headerStyle: {
      whiteSpace: 'nowrap',
    },
  },
  {
    // Average: 10, Longest: 23 but preserve hyphenated Athabaskan-Eyak-Tlingit
    title: 'Language Family',
    field: 'Language Family',
    editable: 'never',
    searchable: true,
    headerStyle: {
      whiteSpace: 'nowrap',
    },
  },
  {
    // Average: 12, Longest: 26
    title: '*Neighborhoods',
    field: 'Neighborhoods',
    searchable: true,
    editable: 'never',
    render: utils.renderNeighbColumn,
    customSort: utils.sortNeighbs,
  },
  {
    // Longest: 14
    title: '*Size',
    field: 'Size',
    align: 'left',
    editable: 'never',
    lookup: COMM_SIZE_COL_MAP,
    render: (data) => COMM_SIZE_COL_MAP[data.Size],
    searchable: false,
  },
  {
    // Longest: 13
    title: '*Status',
    field: 'Status',
    searchable: false,
    editable: 'never',
    lookup: {
      Community: 'Community',
      Historical: 'Historical',
      Liturgical: 'Liturgical',
      Residential: 'Residential',
      Reviving: 'Reviving',
    },
  },
  // All hidden from here down
  {
    title: 'Description',
    field: 'Description',
    editable: 'never',
    hidden: true,
    searchable: true,
  },
  {
    title: 'Glottocode',
    field: 'Glottocode',
    editable: 'never',
    hidden: true,
    searchable: true,
  },
  {
    title: 'ISO 639-3',
    field: 'ISO 639-3',
    editable: 'never',
    hidden: true,
    searchable: true,
  },
] as Types.ColumnsConfig[]

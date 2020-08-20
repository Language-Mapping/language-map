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
  tableLayout: 'fixed',
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
    width: 115,
    defaultSort: 'asc',
    searchable: true,
    editable: 'never',
  },
  {
    // Average: 8.5, Longest: 26, Longest full: Anashinaabemowin
    title: 'Endonym',
    field: 'Endonym',
    render: utils.renderEndoColumn,
    width: 130,
    searchable: true,
    editable: 'never',
  },
  {
    // Average: 13, Longest: 25 (thanks AUS & NZ...)
    title: 'World Region',
    field: 'World Region',
    width: 155, // creates 2-liners
    render: utils.renderWorldRegionColumn,
    searchable: true,
    editable: 'never',
  },
  {
    // Average: 8.5, Longest: 35 (w/o big Congos: Average: 8, Longest: 24)
    // ...plus emoji flag and margin
    // TODO: for Countries selection:
    // https://material-ui.com/components/autocomplete/#country-select
    title: 'Countries',
    field: 'Countries',
    width: 180, // full "Russian Federation" (shown first if sorted by Language)
    render: utils.renderCountriesColumn,
    searchable: true,
    editable: 'never',
  },
  {
    // Longest: 20
    title: 'Global Speakers', // the only abbrev so far
    field: 'Global Speaker Total',
    width: 105, // leaves room for Sort arrow
    align: 'left',
    type: 'numeric',
    searchable: false,
    editable: 'never',
  },
  {
    // Average: 10, Longest: 23 but preserve hyphenated Athabaskan-Eyak-Tlingit
    title: 'Language Family',
    field: 'Language Family',
    width: 140,
    searchable: true,
    editable: 'never',
  },
  {
    // Average: 12, Longest: 26
    title: '*Neighborhoods',
    field: 'Neighborhoods',
    width: 155, // some wrapping but not bad; leaves room for Sort arrow
    searchable: true,
    editable: 'never',
    render: utils.renderNeighbColumn,
    // TODO: some kind of `useState` to set asc/desc and sort Neighborhoods
    // properly (blanks last, regardless of direction)
    // CRED: https://stackoverflow.com/a/29829361/1048518
    customSort: function sortNeighbs(a, b) {
      if (a.Neighborhoods === b.Neighborhoods) {
        return 0
      }

      // nulls sort after anything else
      if (a.Neighborhoods === '') {
        return 1
      }

      if (b.Neighborhoods === '') {
        return -1
      }

      return a.Neighborhoods < b.Neighborhoods ? -1 : 1

      // If descending, highest sorts first
      // return a.Neighborhoods < b.Neighborhoods ? 1 : -1
    },
  },
  {
    // Longest: 14
    title: '*Size',
    field: 'Size',
    width: 125, // leaves room for Sort arrow
    align: 'left',
    lookup: COMM_SIZE_COL_MAP,
    render: (data) => COMM_SIZE_COL_MAP[data.Size],
    searchable: false,
    editable: 'never',
  },
  {
    // Longest: 13
    title: '*Status',
    field: 'Status',
    width: 110,
    searchable: false,
    editable: 'never',
    lookup: {
      Historical: 'Historical',
      Community: 'Community',
      Liturgical: 'Liturgical',
      Residential: 'Residential',
      Reviving: 'Reviving',
    },
  },
  {
    title: 'Description',
    field: 'Description',
    hidden: true,
    searchable: true,
    editable: 'never',
  },
  {
    title: 'Glottocode',
    field: 'Glottocode',
    hidden: true,
    searchable: true,
    editable: 'never',
  },
  {
    title: 'ISO 639-3',
    field: 'ISO 639-3',
    hidden: true,
    searchable: true,
    editable: 'never',
  },
] as Types.ColumnsConfig[]

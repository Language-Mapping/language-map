import { Icons } from 'material-table'
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

export const localization = {
  header: {
    actions: '', // don't need anything here
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
  searchFieldAlignment: 'left', // TODO: rm if not using global search
  search: true, // TODO: confirm
  tableLayout: 'fixed',
  thirdSortClick: false,
  // TODO: rm unused, or keep for reference
  // headerStyle: { position: 'sticky', top: 0 },
  // filterCellStyle: { backgroundColor: 'yellow' }, // works
  // filterRowStyle: { backgroundColor: 'red' }, // works, but sticky 2 tricky!
  // padding: 'dense', // dense leads to choppier inconsistent row height
  // rowStyle: { backgroundColor: 'turquoise' }, // works
  // fixedColumns: { left: 1 }, // useless if using Actions
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
  },
  {
    // Average: 8.5, Longest: 26
    title: 'Endonym',
    field: 'Endonym',
    render: utils.renderEndoColumn,
    width: 115,
  },
  {
    // Average: 12, Longest: 26
    title: 'Neighborhoods',
    field: 'Neighborhoods',
    width: 155, // some wrapping but not bad; leaves room for Sort arrow
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
    title: 'Community Size',
    field: 'Community Size',
    width: 125, // leaves room for Sort arrow
    searchable: false,
    align: 'left',
    lookup: {
      1: '1 - Smallest',
      2: '2 - Small',
      3: '3 - Medium',
      4: '4 - Large',
      5: '5 - Largest',
    },
    render: utils.renderCommSizeColumn,
  },
  {
    // Longest: 13
    title: 'Status',
    field: 'Status',
    width: 110,
    searchable: false,
    lookup: {
      Historical: 'Historical',
      Community: 'Community',
      Liturgical: 'Liturgical',
      Residential: 'Residential',
      Reviving: 'Reviving',
    },
  },
  {
    // Average: 13, Longest: 25 (thanks AUS & NZ...)
    title: 'World Region',
    field: 'World Region',
    width: 145, // creates 2-liners
    render: utils.renderWorldRegionColumn,
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
  },
  {
    // Longest: 20
    title: 'Global Speakers', // TODO: ok to abbrev?
    field: 'Global Speaker Total',
    width: 105, // leaves room for Sort arrow
    searchable: false,
    align: 'left',
    type: 'numeric',
  },
  {
    // Average: 10, Longest: 23
    // ...BUT must preserve hyphenated Athabaskan-Eyak-Tlingit
    title: 'Language Family',
    field: 'Language Family',
    width: 140,
  },
  {
    // Gigantic, will trigger into popover but needs to be searchable
    title: 'Description',
    field: 'Description',
    hidden: true,
    searchable: true,
  },
] as Types.ColumnsConfig[]

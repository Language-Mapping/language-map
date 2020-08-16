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
  // actionsColumnIndex: 1,
  columnsButton: true,
  detailPanelColumnAlignment: 'right',
  doubleHorizontalScroll: true,
  filtering: true,
  // grouping: true, // TODO: restore once the rest is cool
  maxBodyHeight: 'calc(100vh - 175px)', // '60vh',
  headerStyle: { position: 'sticky', top: 0 },
  // filterCellStyle: { color: 'green' },
  pageSize: 20,
  pageSizeOptions: [5, 10, 20, 50],
  searchFieldAlignment: 'left', // TODO: rm if not using global search
  search: false, // TODO: confirm
  tableLayout: 'fixed',
  thirdSortClick: false,
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
    width: 120,
    defaultSort: 'asc',
  },
  {
    // Average: 8.5, Longest: 26
    title: 'Endonym',
    field: 'Endonym',
    render: utils.renderEndoColumn,
    width: 120,
  },
  {
    // Average: 12, Longest: 26
    title: 'Neighborhoods',
    field: 'Neighborhoods',
    width: 185,
    render: utils.renderNeighbColumn,
  },
  {
    // Longest: 14
    title: 'Community Size',
    field: 'Community Size',
    searchable: false,
    type: 'numeric',
    align: 'left',
    width: 115,
    lookup: {
      1: 'Smallest',
      2: 'Small',
      3: 'Medium',
      4: 'Large',
      5: 'Largest',
    },
  },
  {
    // Longest: 13
    title: 'Status',
    field: 'Status',
    width: 115,
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
    width: 150, // creates 2-liners
  },
  {
    // Average: 8.5, Longest: 35 (w/o big Congos: Average: 8, Longest: 24)
    // ...plus emoji flag and margin
    title: 'Countries',
    field: 'Countries',
    render: utils.renderCountriesColumn,
    width: 170, // full "Russian Federation" (shown first if sorted by Language)
  },
  {
    // Longest: 20
    title: 'Global Speakers', // TODO: ok to abbrev?
    field: 'Global Speaker Total',
    searchable: false,
    align: 'left',
    type: 'numeric',
    width: 100, // keep column heading at 2 lines after "Speaker" if using that
  },
  {
    // Average: 10, Longest: 23
    // ...BUT must preserve hyphenated Athabaskan-Eyak-Tlingit
    title: 'Language Family',
    field: 'Language Family',
    width: 140,
  },
  {
    // Gigantic, just using ellipsis
    title: 'Description',
    field: 'Description',
    hidden: true,
  },
] as Types.ColumnsConfig[]

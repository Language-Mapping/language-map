import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
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

export const useTableStyles = makeStyles((theme: Theme) =>
  createStyles({
    tableRoot: {
      // TODO: rm once horiz. scroll is figured out
      // '& .MuiTable-root': {
      //   minWidth: 750,
      // },
      // Gross way to get the table footer, which has no unique classes
      '& .MuiTable-root:last-of-type': {
        position: 'sticky',
        bottom: 0,
        backgroundColor: theme.palette.common.white,
      },
      '& .MuiTableBody-root': {
        fontSize: '0.85rem',
      },
      '& .MuiToolbar-root .MuiIconButton-label': {
        color: theme.palette.primary.main,
      },
      // e.g. the Filter icon at beginning of column filters
      '& .MuiInputAdornment-root': {
        color: theme.palette.grey[500],
      },
      '& .MuiTableCell-head': {
        fontWeight: 'bold',
        lineHeight: 1.2,
        color: theme.palette.primary.main,
      },
      '& .MuiTableCell-root:not(.MuiTableCell-footer)': {
        padding: `5px 8px 5px 12px`, // this may do nothing if height/width set
        height: 50, // CRED: https://stackoverflow.com/a/25329017/1048518
      },
      '& .MuiTableFooter-root': {
        justifyContent: 'center',
      },
      '& .MuiTablePagination-spacer': {
        display: 'none',
      },
      '& .MuiTablePagination-select': {
        paddingLeft: 0,
      },
      [theme.breakpoints.down('sm')]: {
        '& .MuiTableFooter-root .MuiIconButton-root': {
          // Waaaaayy too much default padding, can't see on mobile
          padding: 4,
        },
      },
    },
  })
)

export const localization = {
  header: {
    actions: '', // don't need anything here
  },
}

// Table options for the <MaterialTable> component
export const options = {
  // actionsColumnIndex: 1,
  columnsButton: true,
  doubleHorizontalScroll: true,
  filtering: true,
  grouping: true, // TODO: restore once the rest is cool
  // filterCellStyle: { color: 'green' },
  pageSize: 20,
  pageSizeOptions: [5, 10, 20, 50],
  searchFieldAlignment: 'left',
  showTitle: false,
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
    title: 'Type',
    field: 'Type',
    width: 115,
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

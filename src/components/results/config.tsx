import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Link } from '@material-ui/core'
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
import { isURL } from '../../utils'

export const useTableStyles = makeStyles((theme: Theme) =>
  createStyles({
    tableRoot: {
      // TODO: rm once horiz. scroll is figured out
      // '& .MuiTable-root': {
      //   minWidth: 750,
      // },
      '& .MuiToolbar-root .MuiIconButton-label': {
        color: theme.palette.primary.main,
      },
      '& .MuiInputAdornment-root': {
        color: theme.palette.grey[600],
      },
      '& .MuiTableCell-head': {
        fontWeight: 'bold',
        lineHeight: 1.2,
        color: theme.palette.primary.main,
      },
      '& .MuiTableCell-root': {
        padding: `6px 10px`,
        [theme.breakpoints.up('sm')]: {
          padding: `6px 14px`,
        },
      },
    },
  })
)

// Table options for the <MaterialTable> component
export const options = {
  columnsButton: true,
  doubleHorizontalScroll: true,
  draggable: false,
  filtering: true,
  // filterCellStyle: { color: 'green' },
  pageSize: 10,
  pageSizeOptions: [5, 10, 25, 50],
  searchFieldAlignment: 'left',
  showTitle: false,
  thirdSortClick: false,
} as Types.TableOptions

export const icons = {
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

export const columns = [
  { title: 'Language', field: 'Language' },
  {
    title: 'Endonym',
    field: 'Endonym',
    render: function renderEndo(data) {
      if (!isURL(data.Endonym)) {
        return data.Endonym
      }

      return (
        <Link href={data.Endonym} target="_blank" rel="noreferrer">
          Download image
        </Link>
      )
    },
  },
  { title: 'Neighborhoods', field: 'Neighborhoods' },
  { title: 'Community Size', field: 'Community Size', searchable: false },
  { title: 'Type', field: 'Type' },
  { title: 'World Region', field: 'World Region' },
  { title: 'Countries', field: 'Countries' },
  {
    title: 'Global Speaker Total',
    field: 'Global Speaker Total',
    searchable: false,
  },
  { title: 'Language Family', field: 'Language Family' },
  {
    title: 'Description',
    field: 'Description',
    render: (data) => `${data.Description.slice(0, 20)}...`,
  },
  // { title: 'Description', field: 'Description' }, // TODO: restore/truncate
  // TODO: adapt and restore
  // {
  //   title: 'Birth Year',
  //   field: 'birthYear',
  //   type: 'numeric',
  // },
  // {
  //   title: 'Birth Place',
  //   field: 'birthCity',
  //   lookup: { 34: 'İstanbul', 63: 'Şanlıurfa' },
  // },
] as Types.ColumnsConfig[]

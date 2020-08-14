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
import { LangRecordSchema } from '../../context/types'
import countryCodes from './config.emojis.json'

type CountryCodes = {
  [key: string]: string
}

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
  filtering: true,
  grouping: true,
  // filterCellStyle: { color: 'green' },
  pageSize: 10,
  pageSizeOptions: [5, 10, 25, 50],
  searchFieldAlignment: 'left',
  showTitle: false,
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

// ISO 3166-1 alpha-2 (⚠️ No support for IE 11)
function countryToFlag(isoCode: string) {
  if (typeof String.fromCodePoint === 'undefined') {
    return isoCode
  }

  return isoCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
}

// DISCREPANCIES: Democratic Republic of Congo, Ivory Coast
// ABSENT: Congo-Brazzaville and related
// MAYA'S OLD VS. ROSS'S NEW: Micronesia? Korea?
function renderCountries(data: LangRecordSchema): string | React.ReactNode {
  if (!data.Countries) {
    return ''
  }

  const gahhh = countryCodes as CountryCodes
  const countries = data.Countries.split(', ')

  const countriesWithFlags = countries.map((country) => {
    if (gahhh[country]) {
      return countryToFlag(gahhh[country])
    }

    return country
  })

  return (
    <>
      {countriesWithFlags.map((countryWithFlag, i) => (
        <div key={countries[i]}>
          {countryWithFlag}
          {`    `}
          {countries[i]}
        </div>
      ))}
    </>
  )
}

function renderEndo(data: LangRecordSchema): string | React.ReactNode {
  if (!isURL(data.Endonym)) {
    return data.Endonym
  }

  return (
    <Link href={data.Endonym} target="_blank" rel="noreferrer">
      Download image
    </Link>
  )
}

export const columns = [
  { title: 'Language', field: 'Language' },
  {
    title: 'Endonym',
    field: 'Endonym',
    render: renderEndo,
  },
  { title: 'Neighborhoods', field: 'Neighborhoods' },
  {
    title: 'Community Size',
    field: 'Community Size',
    searchable: false,
    type: 'numeric',
  },
  { title: 'Type', field: 'Type' },
  { title: 'World Region', field: 'World Region' },
  { title: 'Countries', field: 'Countries', render: renderCountries },
  {
    title: 'Global Speaker Total',
    field: 'Global Speaker Total',
    searchable: false,
    type: 'numeric',
  },
  { title: 'Language Family', field: 'Language Family' },
  {
    title: 'Description',
    field: 'Description',
    render: (data) => `${data.Description.slice(0, 20)}...`,
  },
  // TODO: rm if not using lookup
  // {
  //   title: 'Birth Place',
  //   field: 'birthCity',
  //   lookup: { 34: 'İstanbul', 63: 'Şanlıurfa' },
  // },
] as Types.ColumnsConfig[]

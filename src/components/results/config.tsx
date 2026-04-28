/* eslint-disable react/display-name */
import React from 'react'

import { Statuses } from 'components/context/types'

import * as Types from './types'
import * as utils from './utils'
import * as Cells from './Cells'

import { mediaHasUrlOperator } from './MediaColumnFilter'
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

export const tableExportMeta = {
  pageTitle: 'Languages of New York City',
  filename: 'nyc-language-data',
  fullDatasetURL: 'https://airtable.com/shrqQo5FJHvhKtffs',
}

const SIZE_MAP = {
  Smallest: 1,
  Small: 2,
  Medium: 3,
  Large: 4,
  Largest: 5,
}

const COMM_SIZES = {
  Smallest: 'Smallest',
  Small: 'Small',
  Medium: 'Medium',
  Large: 'Large',
  Largest: 'Largest',
}

const commonColProps = {
  editable: false,
  filterable: true,
  sortable: true,
}

const hiddenCols: Types.LangColumn[] = [
  {
    headerName: 'Glottocode',
    title: 'Glottocode',
    field: 'Glottocode',
    flex: 1,
    minWidth: 120,
    hidden: true,
    ...commonColProps,
  },
  {
    headerName: 'ISO 639-3',
    title: 'ISO 639-3',
    field: 'ISO 639-3',
    flex: 1,
    minWidth: 120,
    hidden: true,
    ...commonColProps,
  },
  {
    headerName: 'Additional Neighborhoods',
    title: 'Additional Neighborhoods',
    field: 'Additional Neighborhoods',
    flex: 1,
    minWidth: 200,
    hidden: true,
    ...commonColProps,
  },
]

export const columns: Types.LangColumn[] = [
  {
    headerName: '',
    title: 'View in map',
    field: 'actions-id',
    width: 56,
    sortable: false,
    filterable: false,
    export: false,
    renderCell: utils.renderIDcolumn,
  },
  {
    headerName: '',
    title: 'County',
    field: 'actions-county',
    width: 56,
    sortable: false,
    filterable: false,
    export: false,
    renderCell: utils.renderDescripCol,
  },
  {
    headerName: 'Language',
    title: 'Language',
    field: 'Language',
    flex: 1,
    minWidth: 140,
    ...commonColProps,
  },
  {
    headerName: 'Endonym',
    title: 'Endonym',
    field: 'Endonym',
    flex: 1,
    minWidth: 140,
    ...commonColProps,
    renderCell: utils.renderEndoColumn,
  },
  {
    headerName: 'World Region',
    title: 'World Region',
    field: 'World Region',
    flex: 1,
    minWidth: 160,
    ...commonColProps,
    renderCell: (params) => <Cells.WorldRegion params={params} />,
  },
  {
    headerName: 'Country',
    title: 'Country',
    field: 'Country',
    flex: 1,
    minWidth: 180,
    ...commonColProps,
    renderCell: utils.renderCountryColumn,
    valueGetter: (params) =>
      Array.isArray(params.row.Country) ? params.row.Country.join(', ') : '',
  },
  {
    headerName: 'Global Speakers',
    title: 'Global Speakers',
    field: 'Global Speaker Total',
    width: 140,
    type: 'number',
    sortable: true,
    filterable: false,
    renderCell: (params) => <Cells.GlobalSpeakers params={params} />,
  },
  {
    headerName: 'Language Family',
    title: 'Language Family',
    field: 'Language Family',
    flex: 1,
    minWidth: 160,
    ...commonColProps,
  },
  {
    headerName: 'Video',
    title: 'Video',
    field: 'Video',
    width: 90,
    sortable: false,
    filterable: true,
    filterOperators: [mediaHasUrlOperator],
    export: false,
    renderCell: (params) => (
      <Cells.MediaColumnCell params={params} columnName="Video" />
    ),
  },
  {
    headerName: 'Audio',
    title: 'Audio',
    field: 'Audio',
    width: 90,
    sortable: false,
    filterable: true,
    filterOperators: [mediaHasUrlOperator],
    export: false,
    renderCell: (params) => (
      <Cells.MediaColumnCell params={params} columnName="Audio" />
    ),
  },
  {
    headerName: 'Location',
    title: <LocalColumnTitle text="Location" />,
    field: 'Primary Location',
    flex: 1,
    minWidth: 160,
    ...commonColProps,
    renderHeader: () => <LocalColumnTitle text="Location" />,
  },
  {
    headerName: 'Size',
    title: <LocalColumnTitle text="Size" />,
    field: 'Size',
    width: 130,
    type: 'singleSelect',
    valueOptions: Object.values(COMM_SIZES),
    lookup: COMM_SIZES,
    sortable: true,
    filterable: true,
    sortComparator: (a, b) => {
      const va = SIZE_MAP[a as keyof typeof SIZE_MAP] || 0
      const vb = SIZE_MAP[b as keyof typeof SIZE_MAP] || 0

      if (va === vb) return 0

      return va > vb ? 1 : -1
    },
    renderCell: (params) => <Cells.CommSize params={params} />,
    renderHeader: () => <LocalColumnTitle text="Size" />,
  },
  {
    headerName: 'Status',
    title: <LocalColumnTitle text="Status" />,
    field: 'Status',
    width: 140,
    type: 'singleSelect',
    valueOptions: Object.values(COMM_STATUS_LOOKUP),
    lookup: COMM_STATUS_LOOKUP,
    sortable: true,
    filterable: true,
    renderCell: (params) => <Cells.CommStatus params={params} />,
    renderHeader: () => <LocalColumnTitle text="Status" />,
  },
  ...hiddenCols,
]

export const initialColumnVisibility = columns.reduce<{
  [key: string]: boolean
}>((acc, col) => {
  if (col.hidden) acc[col.field] = false

  return acc
}, {})

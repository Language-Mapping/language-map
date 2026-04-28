/* eslint-disable react/display-name */
import React from 'react'
import { createColumnHelper } from '@tanstack/react-table'

import { InstanceLevelSchema, Statuses } from 'components/context/types'

import * as Types from './types'
import * as utils from './utils'
import * as Cells from './Cells'

import { mediaUrlFilterFn } from './MediaColumnFilter'
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

const SIZE_MAP: { [key: string]: number } = {
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

const ch = createColumnHelper<InstanceLevelSchema>()

export const columns: Types.ColumnList = [
  ch.display({
    id: 'actions-id',
    header: '',
    size: 56,
    enableSorting: false,
    enableColumnFilter: false,
    enableHiding: false,
    cell: utils.renderIDcolumn,
    meta: { excludeFromExport: true, unfilterable: true },
  }),
  ch.display({
    id: 'actions-county',
    header: '',
    size: 56,
    enableSorting: false,
    enableColumnFilter: false,
    enableHiding: false,
    cell: utils.renderDescripCol,
    meta: { excludeFromExport: true, unfilterable: true },
  }),
  ch.accessor('Language', {
    header: 'Language',
    cell: (info) => info.getValue(),
    meta: { exportTitle: 'Language' },
  }),
  ch.accessor('Endonym', {
    header: 'Endonym',
    cell: utils.renderEndoColumn,
    meta: { exportTitle: 'Endonym' },
  }),
  ch.accessor('World Region', {
    header: 'World Region',
    cell: (info) => <Cells.WorldRegion info={info} />,
    meta: { exportTitle: 'World Region' },
  }),
  ch.accessor(
    (row) => (Array.isArray(row.Country) ? row.Country.join(', ') : ''),
    {
      id: 'Country',
      header: 'Country',
      cell: utils.renderCountryColumn,
      meta: { exportTitle: 'Country' },
    }
  ),
  ch.accessor('Global Speaker Total', {
    header: 'Global Speakers',
    cell: (info) => <Cells.GlobalSpeakers info={info} />,
    enableColumnFilter: false,
    sortingFn: 'basic',
    meta: { exportTitle: 'Global Speakers', unfilterable: true },
  }),
  ch.accessor('Language Family', {
    header: 'Language Family',
    cell: (info) => info.getValue(),
    meta: { exportTitle: 'Language Family' },
  }),
  ch.accessor('Video', {
    header: 'Video',
    cell: (info) => <Cells.MediaColumnCell info={info} columnName="Video" />,
    enableSorting: false,
    filterFn: mediaUrlFilterFn,
    meta: { exportTitle: 'Video', mediaFilter: true, excludeFromExport: true },
  }),
  ch.accessor('Audio', {
    header: 'Audio',
    cell: (info) => <Cells.MediaColumnCell info={info} columnName="Audio" />,
    enableSorting: false,
    filterFn: mediaUrlFilterFn,
    meta: { exportTitle: 'Audio', mediaFilter: true, excludeFromExport: true },
  }),
  ch.accessor('Primary Location', {
    header: () => <LocalColumnTitle text="Location" />,
    cell: (info) => info.getValue(),
    meta: { exportTitle: 'Location' },
  }),
  ch.accessor('Size', {
    header: () => <LocalColumnTitle text="Size" />,
    cell: (info) => <Cells.CommSize info={info} />,
    sortingFn: (a, b) => {
      const va = SIZE_MAP[a.original.Size as string] || 0
      const vb = SIZE_MAP[b.original.Size as string] || 0

      if (va === vb) return 0

      return va > vb ? 1 : -1
    },
    meta: { exportTitle: 'Size', lookup: COMM_SIZES },
  }),
  ch.accessor('Status', {
    header: () => <LocalColumnTitle text="Status" />,
    cell: (info) => <Cells.CommStatus info={info} />,
    meta: { exportTitle: 'Status', lookup: COMM_STATUS_LOOKUP },
  }),
  ch.accessor('Glottocode', {
    header: 'Glottocode',
    cell: (info) => info.getValue(),
    meta: { exportTitle: 'Glottocode' },
  }),
  ch.accessor('ISO 639-3', {
    header: 'ISO 639-3',
    cell: (info) => info.getValue(),
    meta: { exportTitle: 'ISO 639-3' },
  }),
  ch.accessor('Additional Neighborhoods', {
    header: 'Additional Neighborhoods',
    cell: (info) => info.getValue(),
    meta: { exportTitle: 'Additional Neighborhoods' },
  }),
]

// Hide the columns that were `hidden: true` in the material-table config.
export const initialColumnVisibility: { [key: string]: boolean } = {
  Glottocode: false,
  'ISO 639-3': false,
  'Additional Neighborhoods': false,
}

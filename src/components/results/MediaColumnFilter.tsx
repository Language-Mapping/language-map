import React, { FC } from 'react'
import { Checkbox } from '@mui/material'
import { Column } from '@tanstack/react-table'

import { InstanceLevelSchema } from 'components/context/types'
import { LangFilterFn } from './types'

const CHECK_VALUE = 'http'

// TanStack column filter that matches rows whose value contains "http"
// (used for the Audio/Video URL columns).
export const mediaUrlFilterFn: LangFilterFn = (row, columnId, filterValue) => {
  if (!filterValue) return true

  const value = row.getValue(columnId)

  if (!value) return false
  if (typeof value === 'string') return value.includes(CHECK_VALUE)
  if (Array.isArray(value)) {
    return value.some((v) => typeof v === 'string' && v.includes(CHECK_VALUE))
  }

  return false
}

export const MediaColumnFilter: FC<{
  column: Column<InstanceLevelSchema, unknown>
}> = ({ column }) => {
  const checked = (column.getFilterValue() as boolean) || false

  return (
    <Checkbox
      size="small"
      color="secondary"
      checked={checked}
      title="Show only rows with media"
      onChange={(e) => column.setFilterValue(e.target.checked || undefined)}
      sx={{ padding: 0.5 }}
    />
  )
}

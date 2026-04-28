/* eslint-disable react/display-name */
import React, { FC, useState, useCallback, useRef } from 'react'
import { Route, useHistory } from 'react-router-dom'
import {
  DataGrid,
  GridCellParams,
  GridColumnVisibilityModel,
  useGridApiRef,
} from '@mui/x-data-grid'

import { routes } from 'components/config/api'
import { InstanceLevelSchema } from 'components/context'
import { DetailsModal } from './DetailsModal'
import { ResultsToolbar } from './ResultsToolbar'
import { columns as columnConfig, initialColumnVisibility } from './config'
import { ResultsTableProps } from './types'

export const ResultsTable: FC<ResultsTableProps> = (props) => {
  const { data: tableData } = props
  const history = useHistory()
  const apiRef = useGridApiRef()
  const containerRef = useRef<HTMLDivElement>(null)
  const [clearBtnEnabled, setClearBtnEnabled] = useState<boolean>(false)
  const [columnVisibility, setColumnVisibility] = useState<
    GridColumnVisibilityModel
  >(initialColumnVisibility)

  const scrollToTop = useCallback(() => {
    containerRef.current?.scrollIntoView(true)
  }, [])

  const onCellClick = (
    params: GridCellParams<InstanceLevelSchema>,
    event: React.MouseEvent
  ): void => {
    const { field, row } = params

    if (field === 'actions-id') {
      history.push(`/Explore/Language/${row.Language}/${row.id}`)

      return
    }

    if (field === 'actions-county') {
      history.push(`${routes.data}/${row.id}`)

      return
    }

    // Endonym image cells handle their own modal — bail so the row click
    // doesn't double-fire
    if (field === 'Endonym' && row['Font Image Alt']) return

    event.stopPropagation()
  }

  const slotProps = {
    toolbar: {
      clearBtnEnabled,
      setClearBtnEnabled,
      scrollToTop,
      columns: columnConfig,
    },
  }

  return (
    <>
      <Route path={routes.dataDetail}>
        <DetailsModal />
      </Route>
      <div
        ref={containerRef}
        style={{ height: '100%', width: '100%', display: 'flex' }}
      >
        <DataGrid
          apiRef={apiRef}
          rows={tableData}
          columns={columnConfig}
          getRowId={(row) => row.id}
          density="compact"
          disableRowSelectionOnClick
          getRowHeight={() => 'auto'}
          getEstimatedRowHeight={() => 36}
          onCellClick={onCellClick}
          onFilterModelChange={() => {
            setClearBtnEnabled(true)
            scrollToTop()
          }}
          columnVisibilityModel={columnVisibility}
          onColumnVisibilityModelChange={setColumnVisibility}
          initialState={{
            pagination: { paginationModel: { pageSize: 20 } },
          }}
          pageSizeOptions={[10, 20, 50]}
          slots={{ toolbar: ResultsToolbar }}
          slotProps={slotProps}
          sx={{
            '& .MuiDataGrid-cell': {
              alignItems: 'flex-start',
              paddingTop: '6px',
              paddingBottom: '6px',
            },
          }}
        />
      </div>
    </>
  )
}

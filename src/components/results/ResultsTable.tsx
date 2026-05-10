/* eslint-disable react/display-name */
import React, { FC, useMemo, useRef, useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import {
  Box,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
} from '@mui/material'
import { Theme } from '@mui/material/styles'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import {
  ColumnFiltersState,
  ColumnOrderState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import { routes } from 'components/config/api'
import { InstanceLevelSchema } from 'components/context/types'
import { DetailsModal } from './DetailsModal'
import { ResultsToolbar } from './ResultsToolbar'
import { columns as columnConfig, initialColumnVisibility } from './config'
import { MediaColumnFilter } from './MediaColumnFilter'
import { LangColumnMeta, ResultsTableProps } from './types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      width: '100%',
    },
    tableScroll: {
      flex: 1,
      overflow: 'auto',
    },
    table: {
      borderCollapse: 'separate',
      tableLayout: 'auto',
      '& th, & td': {
        verticalAlign: 'top',
      },
    },
    headerRow: {
      backgroundColor: theme.palette.background.paper,
    },
    filterRow: {
      backgroundColor: theme.palette.background.paper,
      '& th': {
        paddingTop: 4,
        paddingBottom: 4,
      },
    },
    bodyRow: {
      cursor: 'pointer',
      '&:hover': { backgroundColor: theme.palette.action.hover },
    },
    actionsCell: {
      paddingLeft: 4,
      paddingRight: 4,
      width: 56,
    },
    pagination: {
      alignItems: 'center',
      borderTop: `1px solid ${theme.palette.divider}`,
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.75rem',
      justifyContent: 'flex-end',
      padding: '0.5rem 1rem',
    },
    paginationBtn: {
      background: 'transparent',
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: 4,
      color: theme.palette.text.primary,
      cursor: 'pointer',
      padding: '0.25rem 0.6rem',
      '&:disabled': {
        cursor: 'not-allowed',
        opacity: 0.4,
      },
    },
  })
)

const PAGE_SIZE_OPTIONS = [10, 20, 50]

export const ResultsTable: FC<ResultsTableProps> = (props) => {
  const { data: tableData } = props
  const classes = useStyles()
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)
  const [clearBtnEnabled, setClearBtnEnabled] = useState<boolean>(false)
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    initialColumnVisibility
  )
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([])

  const columns = useMemo(() => columnConfig, [])

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      globalFilter,
      columnFilters,
      sorting,
      columnVisibility,
      columnOrder,
    },
    onGlobalFilterChange: (updater) => {
      setGlobalFilter(
        typeof updater === 'function' ? updater(globalFilter) : updater
      )
      setClearBtnEnabled(true)
    },
    onColumnFiltersChange: (updater) => {
      setColumnFilters((old) =>
        typeof updater === 'function' ? updater(old) : updater
      )
      setClearBtnEnabled(true)
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 20 },
    },
  })

  const scrollToTop = () => {
    containerRef.current?.scrollTo({ top: 0 })
  }

  const visibleRows: InstanceLevelSchema[] = table
    .getFilteredRowModel()
    .rows.map((r) => r.original)

  // Static config filtered down to only currently-visible columns. Used for
  // CSV/PDF export so hidden columns don't leak into downloads.
  const visibleColumnConfig = columns.filter(
    (col) =>
      columnVisibility[
        (col.id ?? (col as { accessorKey?: string }).accessorKey) as string
      ] !== false
  )

  const resetFilters = () => {
    setGlobalFilter('')
    setColumnFilters([])
    setClearBtnEnabled(false)
    scrollToTop()
  }

  const onCellClick = (
    field: string,
    row: InstanceLevelSchema,
    event: React.MouseEvent
  ): void => {
    if (field === 'actions-id') {
      navigate(`/Explore/Language/${row.Language}/${row.id}`)

      return
    }

    if (field === 'actions-county') {
      navigate(`${routes.data}/${row.id}`)

      return
    }

    if (field === 'Endonym' && row['Font Image Alt']) return

    event.stopPropagation()
  }

  return (
    <Box className={classes.container}>
      <Routes>
        <Route path={routes.dataDetail} element={<DetailsModal />} />
      </Routes>
      <ResultsToolbar
        clearBtnEnabled={clearBtnEnabled}
        setClearBtnEnabled={setClearBtnEnabled}
        scrollToTop={scrollToTop}
        visibleRows={visibleRows}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        resetFilters={resetFilters}
        rowCount={table.getFilteredRowModel().rows.length}
        columns={visibleColumnConfig}
        columnToggles={table.getAllLeafColumns().map((column) => {
          const headerDef = column.columnDef.header
          const label = typeof headerDef === 'string' ? headerDef : column.id

          return {
            id: column.id,
            label,
            isVisible: column.getIsVisible(),
            canHide: column.getCanHide(),
            toggle: () => column.toggleVisibility(),
          }
        })}
      />
      <TableContainer ref={containerRef} className={classes.tableScroll}>
        <Table size="small" stickyHeader className={classes.table}>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className={classes.headerRow}>
                {headerGroup.headers.map((header) => {
                  const sortable = header.column.getCanSort()
                  const sortDir = header.column.getIsSorted()
                  const isActions = header.column.id.startsWith('actions-')

                  return (
                    <TableCell
                      key={header.id}
                      style={{ width: header.getSize() }}
                      className={isActions ? classes.actionsCell : undefined}
                      sortDirection={sortDir || false}
                    >
                      {sortable ? (
                        <TableSortLabel
                          active={!!sortDir}
                          direction={sortDir || 'asc'}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </TableSortLabel>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )
                      )}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
            {/* Per-column filter row, à la material-table */}
            <TableRow className={classes.filterRow}>
              {table.getVisibleLeafColumns().map((column) => {
                const meta = column.columnDef.meta as LangColumnMeta | undefined
                const canFilter = column.getCanFilter() && !meta?.unfilterable

                if (!canFilter) {
                  return <TableCell key={column.id} />
                }

                if (meta?.mediaFilter) {
                  return (
                    <TableCell key={column.id}>
                      <MediaColumnFilter column={column} />
                    </TableCell>
                  )
                }

                if (meta?.lookup) {
                  const value = (column.getFilterValue() as string) || ''

                  return (
                    <TableCell key={column.id}>
                      <Select
                        size="small"
                        variant="standard"
                        fullWidth
                        displayEmpty
                        value={value}
                        onChange={(e) =>
                          column.setFilterValue(e.target.value || undefined)
                        }
                      >
                        <MenuItem value="">All</MenuItem>
                        {Object.values(meta.lookup).map((opt) => (
                          <MenuItem key={opt} value={opt}>
                            {opt}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                  )
                }

                const value = (column.getFilterValue() as string) || ''

                return (
                  <TableCell key={column.id}>
                    <TextField
                      size="small"
                      variant="standard"
                      fullWidth
                      placeholder="Filter…"
                      value={value}
                      onChange={(e) =>
                        column.setFilterValue(e.target.value || undefined)
                      }
                    />
                  </TableCell>
                )
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} hover className={classes.bodyRow}>
                {row.getVisibleCells().map((cell) => {
                  const isActions = cell.column.id.startsWith('actions-')

                  return (
                    <TableCell
                      key={cell.id}
                      onClick={(e) =>
                        onCellClick(cell.column.id, row.original, e)
                      }
                      className={isActions ? classes.actionsCell : undefined}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
            {table.getRowModel().rows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={table.getVisibleLeafColumns().length}
                  align="center"
                  sx={{ py: 4, color: 'text.secondary' }}
                >
                  No communities found. Try fewer criteria or click "Clear
                  filters" to reset the table.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <div className={classes.pagination}>
        <span>
          Rows per page:&nbsp;
          <Select
            size="small"
            variant="standard"
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
          >
            {PAGE_SIZE_OPTIONS.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </Select>
        </span>
        <span>
          {(() => {
            const total = table.getFilteredRowModel().rows.length

            if (total === 0) return '0–0 of 0'

            const { pageIndex, pageSize } = table.getState().pagination
            const start = pageIndex * pageSize + 1
            const end = Math.min((pageIndex + 1) * pageSize, total)

            return `${start}–${end} of ${total}`
          })()}
        </span>
        <button
          type="button"
          className={classes.paginationBtn}
          onClick={() => {
            table.previousPage()
            scrollToTop()
          }}
          disabled={!table.getCanPreviousPage()}
        >
          ‹
        </button>
        <button
          type="button"
          className={classes.paginationBtn}
          onClick={() => {
            table.nextPage()
            scrollToTop()
          }}
          disabled={!table.getCanNextPage()}
        >
          ›
        </button>
      </div>
    </Box>
  )
}

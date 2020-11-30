import * as MapTypes from 'components/map/types'

export type SpatialPanel = MapTypes.SpatialPanelProps
export type CensusQueryID = MapTypes.BoundariesInternalSrcID

export type SheetsQuery = {
  data: SheetsResponse
  isFetching: boolean
  error: Error
}

// ['_original', 'pretty', 'complicated', 'sort_order']
export type SheetsRow = [string, string, 'TRUE' | 'FALSE', string]
export type SheetsResponse = { values: SheetsRow[] }

export type PreppedCensusRow = {
  id: string
  pretty: string
  complicated: boolean
  sortOrder: number
  groupTitle: string
}

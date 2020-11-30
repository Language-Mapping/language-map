import * as MapTypes from 'components/map/types'

export type SpatialPanel = MapTypes.SpatialPanelProps
export type CensusQueryID = MapTypes.BoundariesInternalSrcID

// TODO: make this shared/reusable as it will be hit in several places
export type SheetsQuery = {
  data: SheetsLUTresponse
  isFetching: boolean
  error: Error
}

// e.g. ['_original', 'pretty', 'complicated', 'sort_order']
export type CensusLUTrow = [string, string, 'TRUE' | 'FALSE', string]

// TODO: deal w/google's built-in `data.error`
export type SheetsLUTresponse = { values: CensusLUTrow[] }

export type PreppedCensusLUTrow = {
  id: string
  pretty: string
  complicated: boolean
  sortOrder: number
  groupTitle: string
}

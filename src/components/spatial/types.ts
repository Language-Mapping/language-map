import * as MapTypes from 'components/map/types'
import { ReactQueryStatus } from '../config/types'

export type SpatialPanelProps = MapTypes.SpatialPanelProps
export type CensusQueryID = 'tracts' | 'puma' | 'langConfig'
export type SheetsQuery = { data: SheetsLUTresponse } & ReactQueryStatus

// e.g. ['_original', 'pretty', 'complicated', 'sort_order']
// TODO: convert cols to JSON, don't fart around with col order
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

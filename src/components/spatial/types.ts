import * as MapTypes from 'components/map/types'

export type SpatialPanel = MapTypes.SpatialPanelProps
export type CensusQueryID = MapTypes.BoundariesInternalSrcID
export type CensusStateKey = 'censusField' | 'pumaField'
export type CensusFieldSelectProps = { stateKey: CensusStateKey }

export type GenericUseQuery = {
  data: { vector_layers: { fields: string[] }[] }
  isFetching: boolean
  error: Error
}

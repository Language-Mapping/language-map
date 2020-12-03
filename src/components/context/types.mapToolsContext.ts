import { PreppedCensusLUTrow, CensusQueryID } from 'components/spatial/types'

export type MapToolsAction =
  | { type: 'SET_BOUNDARIES_VISIBLE'; payload: boolean }
  | { type: 'SET_GEOLOC_ACTIVE'; payload: boolean }
  | {
      type: 'SET_CENSUS_FIELD'
      payload?: string
      censusType: CensusQueryID
    }
  | {
      type: 'SET_CENSUS_FIELDS'
      payload: PreppedCensusLUTrow[]
      censusType: CensusQueryID
    }

export type MapToolsDispatch = React.Dispatch<MapToolsAction>

export type InitialMapToolsState = {
  boundariesVisible: boolean
  geolocActive: boolean
  tractsField?: string
  pumaField?: string
  censusDropDownFields: {
    tracts: PreppedCensusLUTrow[]
    puma: PreppedCensusLUTrow[]
  }
  censusActiveFields: {
    tracts?: string
    puma?: string
  }
}

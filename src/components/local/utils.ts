import { MapToolsAction } from 'components/context'
import { UseCensusResponse } from './types'

export const setCensusField = (
  value: UseCensusResponse | null,
  mapToolsDispatch: React.Dispatch<MapToolsAction>
): void => {
  if (!value) {
    mapToolsDispatch({ type: 'CLEAR_CENSUS_FIELD' })

    return
  }

  mapToolsDispatch({
    type: 'SET_CENSUS_FIELD',
    payload: value,
  })
}

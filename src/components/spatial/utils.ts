import { MapToolsAction } from 'components/context'

import * as Types from './types'

export const sortBySort = (
  a: Types.PreppedCensusLUTrow,
  b: Types.PreppedCensusLUTrow
): number => {
  let comparison = 0

  if (a.sort_order > b.sort_order) comparison = 1
  else if (a.sort_order < b.sort_order) comparison = -1

  return comparison
}

export const prepCensusFields = (
  data: Types.LUTschema[],
  groupTitle: string
): Types.PreppedCensusLUTrow[] =>
  data?.map((row) => {
    const complicated = row.complicated === 'TRUE'
    const { original, pretty, sort_order: sortOrder } = row

    return {
      original,
      pretty: `${pretty}${complicated ? '*' : ''}`,
      complicated,
      sort_order: parseFloat(sortOrder),
      groupTitle,
    }
  }) || []

export const setCensusField = (
  value: Types.PreppedCensusLUTrow | null,
  mapToolsDispatch: React.Dispatch<MapToolsAction>
): void => {
  // TODO: consider a 'CLEAR_CENSUS_*****' action
  if (!value) {
    mapToolsDispatch({ type: 'SET_CENSUS_FIELD', censusType: 'tracts' })
    mapToolsDispatch({ type: 'SET_CENSUS_FIELD', censusType: 'puma' })

    return
  }

  const lowerCase = value.groupTitle.toLowerCase()

  // CRED: https://github.com/microsoft/TypeScript/issues/9568
  let clearType: Types.CensusQueryID | undefined
  let setType: Types.CensusQueryID | undefined

  // Clear the one not in question (FRAGILE, if ever more than just these two)
  if (lowerCase.includes('puma')) {
    clearType = 'tracts'
    setType = 'puma'
  } else if (lowerCase.includes('tracts')) {
    clearType = 'puma'
    setType = 'tracts'
  }

  if (clearType === undefined || setType === undefined) return

  mapToolsDispatch({
    type: 'SET_CENSUS_FIELD',
    payload: value.original,
    censusType: setType,
  })
  mapToolsDispatch({ type: 'SET_CENSUS_FIELD', censusType: clearType })
}

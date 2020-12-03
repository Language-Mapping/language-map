import { MapToolsAction } from 'components/context'
import * as Types from './types'

export const sortBySort = (
  a: Types.PreppedCensusLUTrow,
  b: Types.PreppedCensusLUTrow
): number => {
  let comparison = 0

  if (a.sortOrder > b.sortOrder) comparison = 1
  else if (a.sortOrder < b.sortOrder) comparison = -1

  return comparison
}

export const prepCensusFields = (
  data: Types.SheetsLUTresponse,
  groupTitle: string
): Types.PreppedCensusLUTrow[] =>
  data?.values.map((row) => {
    const complicated = row[2] === 'TRUE'

    return {
      id: row[0],
      pretty: `${row[1]}${complicated ? '*' : ''}`,
      complicated,
      sortOrder: parseFloat(row[3]),
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
    payload: value.id,
    censusType: setType,
  })
  mapToolsDispatch({ type: 'SET_CENSUS_FIELD', censusType: clearType })
}

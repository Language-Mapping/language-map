import * as Types from './types'

export const sortBySort = (
  a: Types.PreppedCensusRow,
  b: Types.PreppedCensusRow
): number => {
  let comparison = 0

  if (a.sortOrder > b.sortOrder) comparison = 1
  else if (a.sortOrder < b.sortOrder) comparison = -1

  return comparison
}

export const prepCensusFields = (
  data: Types.SheetsResponse,
  groupTitle: string
): Types.PreppedCensusRow[] =>
  data.values.map((row) => {
    const complicated = row[2] === 'TRUE'

    return {
      id: row[0],
      pretty: `${row[1]}${complicated ? '*' : ''}`,
      complicated,
      sortOrder: parseFloat(row[3]),
      groupTitle,
    }
  })

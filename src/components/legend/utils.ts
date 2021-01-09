import { FinalPrep, AtSymbFields, AtSchemaFields, LegendProps } from './types'

type Compare<T> = (a: T, b: T) => number // TODO: defeat

export const sortArrOfObjects = <T>(key: keyof T): Compare<T> => {
  return (a: T, b: T): number => {
    let comparison = 0

    if (a[key] > b[key]) comparison = 1
    else if (a[key] < b[key]) comparison = -1

    return comparison
  }
}

const finalPrep: FinalPrep = (rows, labelByField, sortByField = 'name') => {
  let labeled

  rows.sort(sortArrOfObjects(sortByField))

  if (labelByField)
    labeled = rows.map((row) => ({
      ...row,
      name: row[labelByField],
    })) as AtSymbFields[]
  else labeled = rows

  return labeled
}

export const prepAirtableResponse = (
  rows: AtSymbFields[],
  tableName: string,
  config?: AtSchemaFields
): LegendProps[] => {
  if (!config) return []

  // FRAGILE: the field to sort on must be included in config.layerSymbFields
  const { groupByField, labelByField, sortByField } = config

  if (!groupByField)
    return [
      {
        items: finalPrep(rows, labelByField, sortByField),
        groupName: tableName,
      },
    ]

  const prepped = rows.reduce((all, thisOne) => {
    const groupName = thisOne[groupByField] as string
    const existing = all[groupName]
    const items = existing ? [...existing.items, thisOne] : [thisOne]

    return { ...all, [groupName]: { groupName, items } }
  }, {} as { [key: string]: LegendProps })

  return Object.keys(prepped)
    .sort() // assumes intent is alphbetical sorting
    .map((group) => {
      const { groupName, items } = prepped[group]

      // Was easier to pass groupName as an object property than to try and mix
      // array/obj (e.g. use key) in the component, so setting it here:
      return {
        groupName,
        items: finalPrep(items.sort(sortArrOfObjects('name')), labelByField),
      }
    })
}

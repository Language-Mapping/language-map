import { RouteableTableNames } from 'components/context'
import { TonsWithAddl } from './types'

// Create nice listy thing w/truncation like
// a, b, c, d, e...
// a, b, c, d
// a
// The list might have undefined values, just couldn't figure out the TS
export const prettyTruncate = (list: string[], limit = 5): string[] =>
  list
    .sort()
    .slice(0, limit)
    .filter((instance) => instance !== undefined)
    .map((instance, i) => {
      if (i === 0) return instance
      if (i === limit - 1) return `, ${instance}...`

      return `, ${instance}`
    })

export const pluralTextIfNeeded = (length: number, text = 'item'): string => {
  if (!length) return ''
  if (length === 1) return `${length} ${text}`

  return `${length} ${text}s`
}

// Mid-level formulas are pretty consistent, except:
//  1. /Explore/Landing does not need a formula
//  2. /Explore/{anything with array field in Language}/:value must check for
//     value existence and then a "contains" since there does not appear to be a
//     way to filter arrays in Airtable.
// Very important that things are wrapped in DOUBLE quotes since some values
// contain single quotes.
export const prepFormula = (
  tableName: RouteableTableNames,
  value?: string
): string => {
  if (tableName === 'Language') return '' // /Explore/Language
  if (!value) return "{languages} != ''" // e.g. /Explore/Country
  if (!value) return ''

  // Neighborhood instance, e.g. /Explore/Neighborhood/Astoria should include
  // additional neighborhoods in the query.
  if (tableName === 'Neighborhood')
    return `AND(
      {Neighborhood} != '',
      FIND(
        "${value}",
        CONCATENATE( ARRAYJOIN({Neighborhood}), ARRAYJOIN({addlNeighborhoods}) )
      ) != 0
    )`

  // My goodness. So fragile. If it weren't for debugger, certain headache!
  if (['Country', 'Macrocommunity', 'Town', 'County'].includes(tableName))
    return `AND({${tableName}} != '', FIND("${value}", ARRAYJOIN({${tableName}})) != 0)`

  return `{${tableName}} = "${value}"`
}

// Mid-level fields are consistent except a few tables need an extra field
export const prepFields = (
  tableName: RouteableTableNames,
  field: RouteableTableNames // gross extra step for Airtable FIND issue
): string[] => {
  const arrayFields: RouteableTableNames[] = [
    'Country',
    'Macrocommunity',
    'Neighborhood',
  ]

  if (tableName === 'Language')
    return [
      'Endonym',
      'name',
      'Primary Locations',
      ...(arrayFields.includes(field) ? [field] : []),
      'worldRegionColor',
      'addlNeighborhoods',
    ]

  const landingFields = ['name', 'languages']
  const addlFields: {
    [key: string]: string[]
  } = {
    'World Region': [...landingFields, 'icon-color'],
    Country: [...landingFields, 'src_image'],
    Neighborhood: [...landingFields, 'Additional Languages', 'County'],
  }

  if (addlFields[tableName] !== undefined) return addlFields[tableName]

  return landingFields
}

export const getUniqueInstances = (
  field: string,
  row: TonsWithAddl,
  value?: string
): string[] => {
  let uniqueInstances = []

  if (field === 'Neighborhood' && !value) {
    uniqueInstances = [
      ...(row.languages || []),
      ...(row['Additional Languages'] || []),
    ]
  } else if (row.languages) {
    uniqueInstances = row.languages
  } else {
    uniqueInstances = row['Primary Locations']
  }

  return uniqueInstances
}

export const pluralize = (text: string): string => {
  const lastChar = text.substring(text.length - 1)

  if (lastChar === 's') return `${text}es`
  if (lastChar === 'y') return `${text.slice(0, text.lastIndexOf(lastChar))}ies`

  return `${text}s`
}

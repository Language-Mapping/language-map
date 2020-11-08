import { LangRecordSchema } from '../../context/types'
import * as Types from './types'

export const getUniqueInstances = (
  field: keyof LangRecordSchema,
  features: LangRecordSchema[],
  parse?: boolean,
  searchValue?: unknown
): string[] =>
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  features.reduce((all: string[], thisOne) => {
    const value = thisOne[field] as string

    if (!value || all.includes(value)) return all // don't need `undefined`

    // YO: need to acct for things like "Turkey, Russia", not just "Turkey"

    // Split out neighborhoods, countries, etc.
    // const DEFAULT_DELIM = ', ' // TODO: you know what
    if (parse && typeof value === 'string') {
      const parsed = value.split(', ').filter((indiv) => !all.includes(indiv))

      if (searchValue && !parsed.includes(searchValue as string)) return all

      return [...all, ...parsed]
    }

    if (searchValue && value !== (searchValue as string)) return all

    return [...all, value as string | number]
  }, [] as string[]) as string[]

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

export const sortByTitle = (
  a: Types.CardConfig,
  b: Types.CardConfig
): number => {
  let comparison = 0

  if (a.title > b.title) comparison = 1
  else if (a.title < b.title) comparison = -1

  return comparison
}

export const pluralTextIfNeeded = (length: number, text = 'item'): string => {
  if (!length) return ''
  if (length === 1) return `${length} ${text}`

  return `${length} ${text}s`
}

// Super-repetitive icons are not useful in card lists.
export const deservesCardIcon = (field: string, value?: string): boolean =>
  value !== undefined || ['Country', 'World Region'].includes(field)

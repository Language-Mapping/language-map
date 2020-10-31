import { LangRecordSchema } from '../../context/types'

export const getUniqueInstances = (
  category: keyof LangRecordSchema,
  features: LangRecordSchema[],
  parse?: boolean
): unknown[] => {
  const uniqueInstances = features.reduce((all, thisOne) => {
    const value = thisOne[category]

    // Don't need `undefined` in our array
    if (!value || all.includes(value)) return all

    // YO: need to acct for things like "Turkey, Russia", not just "Turkey"

    // Split out neighborhoods, countries, etc.
    // const DEFAULT_DELIM = ', ' // TODO: you know what
    if (parse && typeof value === 'string') {
      const parsed = value.split(', ').filter((indiv) => !all.includes(indiv))

      return [...all, ...parsed]
    }

    return [...all, value as string | number]
  }, [] as unknown[])

  return uniqueInstances
}

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

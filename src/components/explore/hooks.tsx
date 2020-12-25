import React, { useContext } from 'react'
import { useQuery } from 'react-query'
import Airtable from 'airtable'
import { BiMapPin } from 'react-icons/bi'

import { GlobalContext, DetailsSchema } from 'components/context'
import { AIRTABLE_BASE, reactQueryDefaults } from 'components/config'
import { AtSymbFields } from 'components/legend/types'
import * as Types from './types'

/**
 * Create unique instances (based on primary neighborhood or town) for Cards
 * @param value Route parameter. See /components/panels/config.tsx for setup
 * @param language Route parameter, e.g. /Explore/Country/Egypt/language
 */
export const useUniqueInstances = (
  value: string | undefined,
  language: string | undefined
): Types.CardConfig[] => {
  const { state } = useContext(GlobalContext)
  const { langFeatures } = state
  const icon = <BiMapPin />
  const footer = 'Click to show in map and display details'

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore // not for lack of trying
  return langFeatures.reduce((all, thisOne) => {
    const { Neighborhood, Town, Language } = thisOne

    // Deep depth
    if (language) {
      if (Language !== language) return all
    } else if (Language !== value) return all

    if (!Neighborhood && all.find((item) => item.title === Town)) return all

    const common = { footer, to: thisOne.id, icon }

    if (!Neighborhood) return [...all, { title: Town, ...common }]

    return [
      ...all,
      ...Neighborhood.split(', ')
        .filter((hood) => !all.find((item) => item.title === hood))
        .map((hood) => ({ title: hood, ...common })),
    ]
  }, [] as Types.CardConfig[]) as Types.CardConfig[]
}

type AirtableOptions = {
  fields?: string[]
  filterByFormula?: string
  view?: string
  sort?: { field: string }[]
}

const airtableQuery = async (tableName: string, options: AirtableOptions) => {
  const base = new Airtable().base(AIRTABLE_BASE)

  return base(tableName)
    .select({ ...options })
    .firstPage()

  // TODO: rm if length/instances not needed
  // const table = base.table('Language')
  // const records = await (await table.select({ fields: ['name'] }).all())
  // return query.then((records) => records)
}

export type SchemaTableFields = {
  name: string
  plural?: string
  definition?: string
  legendHeading?: string
  exploreSortOrder?: number
  routeable?: boolean
  symbolizeable?: boolean
  includeInTable?: boolean
}

export type TonsOfFields = DetailsSchema & AtSymbFields & SchemaTableFields
export type AirtableError = {
  error: string // error type, e.g. UNKNOWN_FIELD_NAME
  message: string
  statusCode: number
}

export type UseAirtable = (
  tableName: string,
  options: AirtableOptions
) => {
  data: TonsOfFields[]
  error: AirtableError | null
  isLoading: boolean
}

export const useAirtable: UseAirtable = (tableName, options) => {
  const { data, isLoading, error } = useQuery<
    { fields: TonsOfFields }[],
    AirtableError
  >([tableName, options], airtableQuery, { ...reactQueryDefaults })

  return {
    error,
    data: data?.map((row) => row.fields) || [],
    isLoading,
  }
}

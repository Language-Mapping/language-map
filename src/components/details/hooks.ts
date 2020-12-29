import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import Airtable from 'airtable'

import { AIRTABLE_BASE, reactQueryDefaults } from 'components/config'
import { DetailsSchema } from 'components/context'
import { useAirtable } from 'components/explore/hooks'

export type UseDetails = {
  error: unknown
  isLoading: boolean
  data: DetailsSchema | null
  notFound?: boolean
  id: string
}

export type DetailsRecord = { id: string; fields: DetailsSchema }

const getRecordByID = (id = '99999999999') => {
  const base = new Airtable().base(AIRTABLE_BASE)
  const records = base('Data')
    .select({ filterByFormula: `{id} = ${id}` })
    .firstPage()

  return records.then((rows) => rows)
}

export const useDetails = (paramsField = 'id'): UseDetails => {
  const params = useParams() as { [key: string]: string }
  const param = params[paramsField]

  const { data, isLoading, error } = useQuery<DetailsRecord[]>(
    ['Details', param],
    () => getRecordByID(param),
    // { refetchOnWindowFocus: false }
    // ,
    // { ...reactQueryDefaults, refetchOnMount: true }
    reactQueryDefaults
  )

  const notFound = data && data.length === 0

  return {
    error,
    id: param,
    data: data && data.length && data[0].fields ? data[0].fields : null,
    notFound,
    isLoading,
  }
}

// TODO: put the logic of isInstance in here
export const useDetailsNew = (paramsField = 'id'): UseDetails => {
  const params = useParams() as { [key: string]: string }
  const param = params[paramsField]

  const { data, isLoading, error } = useAirtable('Data', {
    fields: [
      'Language',
      'Description',
      'Town',
      'Neighborhood',
      'Additional Neighborhoods',
    ],
    filterByFormula: `{id} = ${param}`,
    maxRecords: 1,
  })

  const instanceLevel = data[0]

  const {
    data: langData,
    isLoading: isLangLoading,
    error: langError,
  } = useAirtable(
    'Language',
    {
      // fields: [], // TODO
      filterByFormula: `{name} = '${instanceLevel?.Language}'`,
      maxRecords: 1,
    },
    { ...reactQueryDefaults, enabled: !!instanceLevel }
  )

  const langLevel = langData[0] || {}
  let theData = null

  if (langData.length) {
    theData = {
      ...langLevel,
      ...instanceLevel,
      'Language Description': langLevel?.Description,
      Neighborhood: instanceLevel?.Neighborhood,
      Town: instanceLevel?.Town,
    }
  }

  return {
    error: error || langError,
    id: param,
    data: theData,
    isLoading: isLoading || isLangLoading,
    notFound: instanceLevel === undefined,
  }
}

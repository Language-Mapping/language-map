import { useParams } from 'react-router-dom'

import { reactQueryDefaults } from 'components/config'
import { useAirtable } from 'components/explore/hooks'
import { UseDetails } from './types'

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

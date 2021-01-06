import { useParams } from 'react-router-dom'

import { reactQueryDefaults } from 'components/config'
import { useAirtable } from 'components/explore/hooks'
import { InstanceLevelSchema, LangLevelSchema } from 'components/context'
import { UseDetails } from './types'

const dataFields: Array<Extract<keyof InstanceLevelSchema, string>> = [
  'Additional Neighborhoods',
  'descriptionID',
  'Language',
  'Neighborhood',
  'Town',
]

const langFields: Array<Extract<keyof LangLevelSchema, string>> = [
  'Audio',
  'censusField',
  'censusPretty',
  'censusScope',
  'Country',
  'countryImg',
  'descriptionID',
  'Endonym',
  'Font Image Alt',
  'name',
  'Video',
  'World Region',
  'worldRegionColor',
]

// TODO: put the logic of isInstance in here
export const useDetails = (paramsField = 'id'): UseDetails => {
  const params = useParams() as { [key: string]: string }
  const param = params[paramsField]

  const { data, isLoading, error } = useAirtable('Data', {
    fields: dataFields,
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
      fields: langFields,
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
      instanceDescripID: instanceLevel?.descriptionID,
      langDescripID: langLevel?.descriptionID,
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

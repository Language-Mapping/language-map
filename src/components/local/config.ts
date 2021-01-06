import { CensusScope } from './types'
import { GOOGLE_API_KEY, GOOGLE_API_BASE, CONFIG_ENDPOINT } from '../config'

const CONFIG_SHEET = 'Config'
const KEY_SUFFIX = `?key=${GOOGLE_API_KEY}`

// NOTE: originally started with specific ranges in the URL params (e.g.
// Sheet1!A2:K) but that got way too hard to maintain as new columns are often
// added or moved.
export const langConfigEndpoint = `${CONFIG_ENDPOINT}/${CONFIG_SHEET}${KEY_SUFFIX}`

const DEFAULT_SHEET_NAME = 'Sheet1'

// "Tracts2013-2017" workbook
const TRACTS_SPREADSHEET_ID = '1pMvLpzdqO40MZWcyU5Lxabs-tP_eqoY6_TRF4p-EIXg'
const TRACTS_VALUES_ENDPOINT = `${GOOGLE_API_BASE}/${TRACTS_SPREADSHEET_ID}/values`

// "PUMA2013-2017" workbook
const PUMA_SPREADSHEET_ID = '1oDRHKvmCQVEG_OoczA_IwsJUIO51IIOBnMgK6utuwO4'
const PUMA_VALUES_ENDPOINT = `${GOOGLE_API_BASE}/${PUMA_SPREADSHEET_ID}/values`

export const tableEndpoints = {
  puma: `${PUMA_VALUES_ENDPOINT}/${DEFAULT_SHEET_NAME}${KEY_SUFFIX}`,
  tract: `${TRACTS_VALUES_ENDPOINT}/${DEFAULT_SHEET_NAME}${KEY_SUFFIX}`,
} as {
  [key in CensusScope]: string
}

// Used in census dropdown/autocomplete
export const censusGroupHeadings = {
  tract: {
    title: 'Census Tracts',
    subTitle:
      'Tracts are the smallest census unit at which language data is provided and will be used here whenever available.',
  },
  puma: {
    title: 'Public Use Microdata Areas (PUMAs)',
    subTitle:
      'Larger than tracts, PUMAs are a less granular census unit used here whenever tract-level is unavailable.',
  },
} as {
  [key in CensusScope]: {
    title: string
    subTitle: string
  }
}

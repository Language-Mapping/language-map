import { CensusQueryID } from './types'
import { GOOGLE_API_KEY, GOOGLE_API_BASE, BASE_ENDPOINT } from '../config'

const CONFIG_SHEET = 'Config'
const PUMA_LUT_SHEET = 'LUT_PUMA_Fields'
const TRACT_LUT_SHEET = 'LUT_Tract_Fields'
const CENSUS_LUT_RANGE = '!A1:D' // slightly safer than Named Ranges?
const CENSUS_LUT_SUFFIX = `${CENSUS_LUT_RANGE}?key=${GOOGLE_API_KEY}`

export const configEndpoints = {
  puma: `${BASE_ENDPOINT}/${PUMA_LUT_SHEET}${CENSUS_LUT_SUFFIX}`,
  tracts: `${BASE_ENDPOINT}/${TRACT_LUT_SHEET}${CENSUS_LUT_SUFFIX}`,
  langConfig: `${BASE_ENDPOINT}/${CONFIG_SHEET}!A:L?key=${GOOGLE_API_KEY}`,
} as {
  [key in CensusQueryID]: string
}

// TODO: rm tracts lookup table when ready
// TODO: migrate non-LUT config to separate file?
const DEFAULT_SHEET_NAME = 'Sheet1'

// "Tracts2013-2017" workbook
const TRACTS_SPREADSHEET_ID = '1pMvLpzdqO40MZWcyU5Lxabs-tP_eqoY6_TRF4p-EIXg'
const TRACTS_VALUES_ENDPOINT = `${GOOGLE_API_BASE}/${TRACTS_SPREADSHEET_ID}/values`
const TRACTS_SUFFIX = `!A:K?key=${GOOGLE_API_KEY}`

// "PUMA2013-2017" workbook
const PUMA_SPREADSHEET_ID = '1oDRHKvmCQVEG_OoczA_IwsJUIO51IIOBnMgK6utuwO4'
const PUMA_VALUES_ENDPOINT = `${GOOGLE_API_BASE}/${PUMA_SPREADSHEET_ID}/values`
const PUMA_SUFFIX = `?key=${GOOGLE_API_KEY}`

export const tableEndpoints = {
  puma: `${PUMA_VALUES_ENDPOINT}/${DEFAULT_SHEET_NAME}${PUMA_SUFFIX}`,
  tracts: `${TRACTS_VALUES_ENDPOINT}/${DEFAULT_SHEET_NAME}${TRACTS_SUFFIX}`,
} as {
  [key in CensusQueryID]: string
}

export const censusGroupHeadings = {
  tracts:
    'Census Tracts|||Tracts are the smallest census unit at which language data is provided and will be used here whenever available.',
  puma:
    'Public Use Microdata Areas (PUMAs)|||Larger than tracts, PUMAs are a less granular census unit used here whenever tract-level is unavailable.',
} as {
  [key in CensusQueryID]: string
}

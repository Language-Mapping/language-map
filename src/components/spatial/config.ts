import { CensusQueryID } from './types'
import { GOOGLE_API_KEY } from '../config'

const GOOGLE_API_BASE = `https://sheets.googleapis.com/v4/spreadsheets`

// "Languages Config" workbook
const CONFIG_SPREADSHEET_ID = '1Ts7CvmlKVqCZs_AJ3hf5x1my2p-vaX7q5HxaXiduiEc'
const CONFIG_VALUES_ENDPOINT = `${GOOGLE_API_BASE}/${CONFIG_SPREADSHEET_ID}/values`
const PUMA_LUT_SHEET_NAME = 'LUT_PUMA_Fields'
const TRACT_LUT_SHEET_NAME = 'LUT_Tract_Fields'
const CENSUS_LUT_RANGE = '!A2:D' // slightly safer than Named Ranges?
const CENSUS_LUT_SUFFIX = `${CENSUS_LUT_RANGE}?key=${GOOGLE_API_KEY}`

export const configEndpoints = {
  puma: `${CONFIG_VALUES_ENDPOINT}/${PUMA_LUT_SHEET_NAME}${CENSUS_LUT_SUFFIX}`,
  tracts: `${CONFIG_VALUES_ENDPOINT}/${TRACT_LUT_SHEET_NAME}${CENSUS_LUT_SUFFIX}`,
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

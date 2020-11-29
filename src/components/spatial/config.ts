import { CensusQueryID } from './types'

const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY // TODO: globalize
const SPREADSHEET_ID = '1Ts7CvmlKVqCZs_AJ3hf5x1my2p-vaX7q5HxaXiduiEc' // ROSS
const GOOGLE_API_BASE = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}`
const PUMA_LUT_SHEET_NAME = 'LUT_PUMA_Fields'
const TRACT_LUT_SHEET_NAME = 'LUT_Tract_Fields'
const VALUES_ENDPOINT = `${GOOGLE_API_BASE}/values`

export const censusFieldsDropdownOmit = ['GEOID', 'NAMELSAD']
const RELEVANT_RANGE = '!A2:D'

// YO: use from config?
export const endpoints = {
  puma: `${VALUES_ENDPOINT}/${PUMA_LUT_SHEET_NAME}${RELEVANT_RANGE}?key=${GOOGLE_API_KEY}`,
  tracts: `${VALUES_ENDPOINT}/${TRACT_LUT_SHEET_NAME}${RELEVANT_RANGE}?key=${GOOGLE_API_KEY}`,
} as {
  [key in CensusQueryID]: string
}

// TODO: rm tracts lookup table when ready

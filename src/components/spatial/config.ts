import { CensusQueryID } from './types'
import { GOOGLE_API_KEY } from '../config'

const SPREADSHEET_ID = '1Ts7CvmlKVqCZs_AJ3hf5x1my2p-vaX7q5HxaXiduiEc'
const GOOGLE_API_BASE = `https://sheets.googleapis.com/v4/spreadsheets`
const PUMA_LUT_SHEET_NAME = 'LUT_PUMA_Fields'
const TRACT_LUT_SHEET_NAME = 'LUT_Tract_Fields'
const VALUES_ENDPOINT = `${GOOGLE_API_BASE}/${SPREADSHEET_ID}/values`
const RELEVANT_RANGE = '!A2:D' // slightly safer than Named Ranges?

export const endpoints = {
  puma: `${VALUES_ENDPOINT}/${PUMA_LUT_SHEET_NAME}${RELEVANT_RANGE}?key=${GOOGLE_API_KEY}`,
  tracts: `${VALUES_ENDPOINT}/${TRACT_LUT_SHEET_NAME}${RELEVANT_RANGE}?key=${GOOGLE_API_KEY}`,
} as {
  [key in CensusQueryID]: string
}

// TODO: rm tracts lookup table when ready

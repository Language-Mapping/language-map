// "Languages Config" workbook
const CONFIG_WORKBOOK_ID = '1Ts7CvmlKVqCZs_AJ3hf5x1my2p-vaX7q5HxaXiduiEc'

export const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY
export const AIRTABLE_API_KEY = process.env.REACT_APP_AIRTABLE_API_KEY as string
export const GOOGLE_API_BASE = `https://sheets.googleapis.com/v4/spreadsheets`
export const CONFIG_ENDPOINT = `${GOOGLE_API_BASE}/${CONFIG_WORKBOOK_ID}/values`
export const CONFIG_QUERY_ID = 'sheets-config'

export const AIRTABLE_BASE = 'applPEl3BsnpuszQu'

// TODO: get this into provider/global so it doesn't need adding every time
export const reactQueryDefaults = {
  staleTime: Infinity,
  // refetchOnMount: false, // TODO: rm/restore if needed
  refetchOnReconnect: true,
  refetchOnWindowFocus: false,
}

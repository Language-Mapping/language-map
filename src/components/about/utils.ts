import { wpConfigs, WP_API_PAGES_ENDPOINT } from './config'

// TODO: DRY this all out with same process as `map.utils.fetchBoundariesLookup`

export const fetchAbout = async (): Promise<void> =>
  (await fetch(`${WP_API_PAGES_ENDPOINT}/${wpConfigs[0].pageID}`)).json()

export const fetchHelp = async (): Promise<void> =>
  (await fetch(`${WP_API_PAGES_ENDPOINT}/${wpConfigs[1].pageID}`)).json()

export const fetchWelcome = async (): Promise<void> =>
  (await fetch(`${WP_API_PAGES_ENDPOINT}/${wpConfigs[2].pageID}`)).json()

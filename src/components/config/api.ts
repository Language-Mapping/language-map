import { RouteLocation } from './types'

export const AIRTABLE_API_KEY = process.env.REACT_APP_AIRTABLE_API_KEY as string
export const AIRTABLE_BASE = 'applPEl3BsnpuszQu'
export const AIRTABLE_CENSUS_BASE = 'appjb6Qnp4lTNz7Gn'

// TODO: get this into provider/global so it doesn't need adding every time
export const reactQueryDefaults = {
  staleTime: Infinity,
  refetchOnMount: false, // TODO: rm if not needed
  refetchOnReconnect: false,
  refetchOnWindowFocus: false,
}

export const routes = {
  home: '/',
  details: '/details',
  about: '/about',
  help: '/help',
  table: '/table',
  local: '/local',
  explore: '/Explore',
} as {
  [key: string]: RouteLocation
}

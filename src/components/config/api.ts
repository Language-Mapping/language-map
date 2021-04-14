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

const censusRoutes = {
  local: '/Census',
  censusDetail: '/Census/:table/:field/:id',
  pumaDetail: '/Census/puma/:field/:id',
  tractDetail: '/Census/tract/:field/:id',
} as {
  [key: string]: RouteLocation
}

const infoRoutes = {
  about: '/Info/About',
  feedback: '/Info/Feedback',
  help: '/Info/Help',
  info: '/Info',
}

export const routes = {
  explore: '/Explore',
  home: '/',
  neighborhood: '/Explore/Neighborhood',
  neighbInstance: '/Explore/Neighborhood/:id',
  countyInstance: '/Explore/County/:id',
  data: '/Data', // aka "table"
  dataDetail: '/Data/:id', // aka "table"
  none: '/Explore/Language/none',
  details: '/Explore/Language/:value/:id',
  countiesBase: '/Explore/County',
  languageInstance: '/Explore/Language/:language',
  ...censusRoutes,
  ...infoRoutes,
} as {
  [key: string]: RouteLocation
}

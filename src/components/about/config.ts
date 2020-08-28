import { RouteLocation } from 'components/map/types'
import { WpQueryNames } from './types'

export const WP_API_PAGES_ENDPOINT =
  'https://languagemapping.org/wp-json/wp/v2/pages'

export const wpConfigs = [
  { name: 'about', pageID: 203 },
  { name: 'glossary', pageID: 209 },
  { name: 'welcome', pageID: 225 },
] as { name: WpQueryNames; pageID: number }[]

// Route paths
export const DATA_TABLE_PATHNAME: RouteLocation = '/table'
export const GLOSSARY_PATHNAME: RouteLocation = '/glossary'
export const ABOUT_PATHNAME: RouteLocation = '/about'

// Unique `react-query` names (used in pre-fetch)
export const ABOUT_QUERY: WpQueryNames = 'about'
export const GLOSSARY_QUERY: WpQueryNames = 'glossary'
export const WELCOME_QUERY: WpQueryNames = 'welcome'

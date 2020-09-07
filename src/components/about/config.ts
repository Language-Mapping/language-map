import { WpQueryNames } from './types'

export const WP_API_PAGES_ENDPOINT =
  'https://languagemapping.org/wp-json/wp/v2/pages'

export const wpConfigs = [
  { name: 'about', pageID: 203 },
  { name: 'glossary', pageID: 209 },
  { name: 'welcome', pageID: 225 },
] as { name: WpQueryNames; pageID: number }[]

// Unique `react-query` names (used in pre-fetch)
export const ABOUT_QUERY: WpQueryNames = 'about'
export const GLOSSARY_QUERY: WpQueryNames = 'glossary'
export const WELCOME_QUERY: WpQueryNames = 'welcome'

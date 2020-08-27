import { WpQueryNames } from './types'

export const WP_API_PAGES_ENDPOINT =
  'https://languagemapping.org/wp-json/wp/v2/pages'

export const wpConfigs = [
  { name: 'about', pageID: 203 },
  { name: 'glossary', pageID: 209 },
  { name: 'welcome', pageID: 225 },
] as { name: WpQueryNames; pageID: number }[]

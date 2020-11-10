import { WpQueryKeys } from './types'

export const WP_API_PAGES_ENDPOINT =
  'https://languagemapping.org/wp-json/wp/v2/pages'

export const wpQueryIDs = {
  about: 203,
  help: 209,
  welcome: 225,
} as { [key in WpQueryKeys]: number }

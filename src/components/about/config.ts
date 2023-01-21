import { WpQueryKeys } from './types'

export const WP_API_PAGES_ENDPOINT =
  'https://content.endangeredlanguagealliance.org/wp-json/wp/v2/pages'

export const wpQueryIDs = {
  about: 9461,
  help: 9518,
} as { [key in WpQueryKeys]: number }

export const HIDE_WELCOME_LOCAL_STG_KEY = 'hideWelcome'

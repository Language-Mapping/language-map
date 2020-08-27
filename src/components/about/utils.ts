import { wpConfigs, WP_API_PAGES_ENDPOINT } from './config'

export const fetchAbout = async (): Promise<void> =>
  (await fetch(`${WP_API_PAGES_ENDPOINT}/${wpConfigs[0].pageID}`)).json()

export const fetchGlossary = async (): Promise<void> =>
  (await fetch(`${WP_API_PAGES_ENDPOINT}/${wpConfigs[1].pageID}`)).json()

export const fetchWelcome = async (): Promise<void> =>
  (await fetch(`${WP_API_PAGES_ENDPOINT}/${wpConfigs[2].pageID}`)).json()

// TODO: make this or similar work to DRY out
// export async function useAbout(pageID: number) {
//   return async function fetchRecipe() {
//     return (await fetch(`${WP_API_PAGES_ENDPOINT}/${pageID}`)).json()
//   }
// }

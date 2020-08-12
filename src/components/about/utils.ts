import { WpApiPageResponse, AboutPageState } from './types'

export const getAboutPageContent = async (
  url: string,
  setAboutPgContent: React.Dispatch<AboutPageState>
): Promise<void> => {
  const response = await fetch(url) // TODO: handle errors
  const { title, content }: WpApiPageResponse = await response.json()

  setAboutPgContent({
    title: title.rendered,
    content: content.rendered,
  })
}

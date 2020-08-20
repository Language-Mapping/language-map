import { WpApiPageResponse, RemoteContentState } from './types'

export const fetchContentFromWP = async (
  url: string,
  setContent: React.Dispatch<RemoteContentState>
): Promise<void> => {
  const response = await fetch(url) // TODO: handle errors
  const { title, content }: WpApiPageResponse = await response.json()

  setContent({
    title: title.rendered,
    content: content.rendered,
  })
}

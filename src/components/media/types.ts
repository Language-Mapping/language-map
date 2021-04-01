import { FullOnEverything } from 'components/details/types'

type MediaKey = 'Video' | 'Audio' | 'share' | 'clear' | 'view'

export type MediaProps = {
  data: FullOnEverything // NOT ACCURATE
  clear?: string // not needed whatsoever, just going through the TS motions?
  share?: string
  view?: string // not needed whatsoever, just going through the TS motions?
  shareNoun?: string // e.g. "community" or "profile"
  omitClear?: boolean // e.g. for pre-Details Explore view
}

export type MediaChildProps = {
  url: string
  title?: string
}

export type MediaListItemProps = {
  label: string
  icon: React.ReactNode
  type: MediaKey
  disabled?: boolean
  variant?: 'text' | 'outlined' | 'contained'
  handleClick: () => void
}

export type MediaModalProps = {
  url: string
  closeModal: () => void
}

export type ModalContentProps = { url: string }

// Same for playlists and individual videos
type YouTubeAPIresponse = {
  items: { snippet: { title: string; description: string } }[]
}

type InternetArchiveAPIresponse = {
  result: {
    title: string
    description: string
  }
}

type APIdataResponse = YouTubeAPIresponse | InternetArchiveAPIresponse

export type APIresponse = {
  isLoading: boolean
  error: Error
  data: APIdataResponse
}

import { DetailsSchema } from 'components/context'

type MediaKey = 'Video' | 'Audio' | 'share' | 'clear' | 'view'

export type MediaProps = {
  data: DetailsSchema
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
  handleClick: () => void
}

export type StyleProps = {
  showShareBtns?: boolean
}

export type MediaModalProps = {
  url: string
  closeModal: () => void
}

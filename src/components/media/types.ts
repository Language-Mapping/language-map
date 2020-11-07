type MediaKey = 'video' | 'audio' | 'share' | 'clear'

export type MediaProps = {
  language: string
  clear?: string // not needed whatsoever, just going through the TS motions
  share?: string
  audio?: string
  video?: string
  description?: string
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

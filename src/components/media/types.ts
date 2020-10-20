type MediaKey = 'video' | 'audio' | 'share'

export type MediaProps = {
  language: string
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

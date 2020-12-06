export type MoreLikeThisProps = {
  language: string
  region: string
  country: string
  macro?: string
}

export type SeeRelatedChipProps = {
  to: string
  name: string
  variant?: 'subtle'
}

export type ChipWithClickProps = {
  text: string
  title?: string
  icon?: React.ReactNode
  handleClick?: () => void
}

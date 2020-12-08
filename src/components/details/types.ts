export type MoreLikeThisProps = {
  region: string
  country: string
  language?: string
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
  handleClick: (e: React.MouseEvent<HTMLDivElement>) => void
}

export type NeighborhoodList = {
  town: string
  neighborhoods: string
}

import { DetailsSchema } from 'components/context'

export type MoreLikeThisProps = {
  data: DetailsSchema
}

export type ChipProps = {
  text: string
  icon: React.ReactNode
  title?: string
  to?: string
  handleClick?: (e: React.MouseEvent<HTMLDivElement>) => void
}

export type NeighborhoodListProps = MoreLikeThisProps
export type LangOrEndoIntroProps = MoreLikeThisProps

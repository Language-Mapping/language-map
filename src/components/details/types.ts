import { DetailsSchema } from 'components/context'

export type MoreLikeThisProps = {
  data: DetailsSchema
  omitLocation?: boolean // don't show Primary Location chip
  omitMacro?: boolean // don't show Macrocommunity chip
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

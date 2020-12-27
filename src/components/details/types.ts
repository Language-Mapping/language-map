import { DetailsSchema } from 'components/context'

export type MoreLikeThisProps = {
  data: DetailsSchema
  isInstance?: boolean
}

export type ChipProps = {
  text: string
  icon: React.ReactNode
  title?: string
  to?: string
  handleClick?: (e: React.MouseEvent<HTMLDivElement>) => void
}

export type NeighborhoodListProps = MoreLikeThisProps
export type DetailedIntroProps = MoreLikeThisProps & { shareNoun?: string }

// TODO: UGH
export type LangOrEndoIntroProps = Pick<MoreLikeThisProps, 'isInstance'> & {
  data: DetailsSchema & { name?: string }
}

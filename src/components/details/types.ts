import { DetailsSchema } from 'components/context'

export type MoreLikeThisProps = {
  data: WithLangDescrip
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

// Part of useDetails Hook return values with lang/instance descrip IDs
export type WithLangDescrip = DetailsSchema & {
  langDescripID?: string
  instanceDescripID?: string
}

// TODO: UGH
export type LangOrEndoIntroProps = Pick<MoreLikeThisProps, 'isInstance'> & {
  data: WithLangDescrip & { name?: string }
}

export type UseDetails = {
  error: unknown
  isLoading: boolean
  data: WithLangDescrip | null
  notFound?: boolean
  id: string
}

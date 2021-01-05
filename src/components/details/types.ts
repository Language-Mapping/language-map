import { DetailsSchema } from 'components/context'

type WithLangDescrip = DetailsSchema & {
  langDescripID?: string
  instanceDescripID?: string
}

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

export type DetailsRecord = { id: string; fields: DetailsSchema }

export type DetailsPanelProps = { routeBase?: string; id?: string }

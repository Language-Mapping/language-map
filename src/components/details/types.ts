import { InstanceLevelSchema, LangLevelSchema } from 'components/context'

// FIXME: the usage of this is not accurate and is overkill for some components
// which only need a handful of props, but it covers the TS base in a pinch
export type FullOnEverything = LangLevelSchema & InstanceLevelSchema

export type MoreLikeThisProps = {
  data: FullOnEverything
  isInstance?: boolean
}

export type ChipProps = {
  text: string
  icon: React.ReactNode
  title?: string
  to?: string
  handleClick?: (e: React.MouseEvent<HTMLDivElement>) => void
}

export type NeighborhoodListProps = MoreLikeThisProps & {
  data: FullOnEverything
}

export type DetailedIntroProps = Pick<MoreLikeThisProps, 'isInstance'> & {
  data: FullOnEverything
  langDescripID?: string
  shareNoun?: string
}

export type DetailsProps = Pick<MoreLikeThisProps, 'isInstance'> & {
  data: FullOnEverything | null
  instanceDescripID?: string
  langDescripID?: string
  shareNoun?: string
}

export type LangOrEndoIntroProps = DetailedIntroProps & { name?: string }

export type UseDetails = {
  error: unknown
  isLoading: boolean
  data: FullOnEverything | null
  notFound?: boolean
  id: string
  instanceDescripID?: string
  langDescripID?: string
}

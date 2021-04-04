import { InstanceLevelSchema, LangLevelSchema } from 'components/context'

// FIXME: the usage of this is not accurate and is overkill for some components
// which only need a handful of props, but it covers the TS base in a pinch
export type FullOnEverything = LangLevelSchema & InstanceLevelSchema

export type TonsOfData = {
  data: FullOnEverything
}

export type ChipProps = {
  text: string
  icon: React.ReactNode
  title?: string
  to?: string
  handleClick?: (e: React.MouseEvent<HTMLDivElement>) => void
}

export type DetailedIntroProps = TonsOfData & {
  isInstance?: boolean
  langDescripID?: string
  shareNoun?: string
}

export type LocationLinkProps = TonsOfData & {
  anchorEl: HTMLDivElement | null
  setAnchorEl: React.Dispatch<HTMLDivElement | null>
}

export type DetailsProps = {
  data: FullOnEverything | null
  instanceDescripID?: string
  langDescripID?: string
  shareNoun?: string
}

export type LangOrEndoIntroProps = DetailedIntroProps

export type UseDetails = {
  error: unknown
  isLoading: boolean
  data: FullOnEverything | null
  notFound?: boolean
  id: string
  instanceDescripID?: string
  langDescripID?: string
}

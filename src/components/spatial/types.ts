import * as MapTypes from 'components/map/types'
import { ArrayOfStringArrays } from 'components/config/types'
import { ReactQueryStatus } from '../config/types'

export type SpatialPanelProps = MapTypes.SpatialPanelProps
export type CensusQueryID = 'tracts' | 'puma' | 'langConfig'

// TODO: deal w/google's built-in `data.error`
export type SheetsQuery = {
  data: { values: ArrayOfStringArrays }
} & ReactQueryStatus

export type PreppedCensusLUTrow = {
  original: string
  pretty: string
  complicated: boolean
  sort_order: number
  groupTitle: string
}

export type GroupHeaderProps = {
  title: string
  subTitle: string
}

export type CensusSelectProps = {
  tracts: PreppedCensusLUTrow[]
  puma: PreppedCensusLUTrow[]
}

export type LUTschema = {
  original: string
  pretty: string
  complicated: string
  sort_order: string
}

export type CensusIntroProps = {
  subtle?: boolean
}

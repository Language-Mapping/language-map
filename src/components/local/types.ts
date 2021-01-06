import { ArrayOfStringArrays } from 'components/config/types'
import { AirtableError } from 'components/explore/types'
import { ReactQueryStatus } from '../config/types'

export type CensusScope = 'tract' | 'puma'

// TODO: deal w/google's built-in `data.error`
export type SheetsQuery = {
  data: { values: ArrayOfStringArrays }
} & ReactQueryStatus

export type GroupHeaderProps = {
  title: string
  subTitle: string
}

export type CensusIntroProps = {
  subtle?: boolean
}

export type UseCensusResponse = {
  id: string
  pretty: string
  scope: CensusScope
  complicated?: boolean
}

export type UseCensusReturn = {
  data: UseCensusResponse[]
  isLoading: boolean
  error: AirtableError | null
}

import { AirtableError } from 'components/explore/types'

export type CensusScope = 'tract' | 'puma'

export type GroupHeaderProps = {
  title: string
  censusScope: CensusScope
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

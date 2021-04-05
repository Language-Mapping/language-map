// TODO: move whole file's contents into config.census.ts
import { CensusScope } from './types'

// Used in census dropdown/autocomplete
export const censusGroupHeadings: {
  [key in CensusScope]: {
    title: string
  }
} = {
  tract: { title: 'Census Tracts' },
  puma: { title: 'Public Use Microdata Areas (PUMAs)' },
}

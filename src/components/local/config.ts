// TODO: move whole file's contents into config.census.ts
import { CensusScope } from './types'

// Used in census dropdown/autocomplete
export const censusGroupHeadings = {
  tract: {
    title: 'Census Tracts',
    subTitle:
      'Tracts are the smallest census unit at which language data is provided and will be used here whenever available.',
  },
  puma: {
    title: 'Public Use Microdata Areas (PUMAs)',
    subTitle:
      'Larger than tracts, PUMAs are a less granular census unit used here whenever tract-level is unavailable.',
  },
} as {
  [key in CensusScope]: {
    title: string
    subTitle: string
  }
}

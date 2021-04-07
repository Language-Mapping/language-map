// NOTE: parts of this file were adapted from an existing GitHub project with an
// MIT License, available here:
// https://github.com/Covid-Self-report-Tool/cov-self-report-frontend/blob/master/LICENSE

import { CensusScope } from 'components/local/types'
import { BaseLayer } from 'components/map/types'

export type LangSchemaCol = keyof InstanceLevelSchema

// Literally only adding Language so that the "No community selected" has a
// Language to work with. Previously we only needed `id` so that `/details/:id`
// was all it took. But now with nested /Explore/Language/Something/:id...
export type InternalWithLang = InternalUse & { Language: string }

export type StoreAction =
  | { type: 'CLEAR_FILTERS'; payload: number }
  | { type: 'SET_LANG_LAYER_FEATURES'; payload: InternalWithLang[] }
  | { type: 'SET_FILTER_HAS_RUN' }

export type InitialState = {
  clearFilters: number
  // Have filters been set for language features. This is used as an attempt to
  // prevent the map from re-rendering on the first load, triggered by the
  // length change of langFeatures.
  filterHasRun: boolean
  langFeatures: InternalWithLang[]
  // Handy for future reference without caching all the features
  langFeatsLenCache: number
}

export type Statuses =
  | 'Historical'
  | 'Community'
  | 'Liturgical'
  | 'Residential'
  | 'Reviving'

// Aka user doesn't really see them
export type InternalUse = {
  id: string // unique (ultimately)
  Latitude: number // nice convenience over geometry.coordinates
  Longitude: number // nice convenience over geometry.coordinates
}

export type LangLevelReqd = {
  name: string
  Endonym: string // often same as English name, may be an http link to image
  countryImg: { url: string }[]
  Country: string[]
  worldRegionColor: string
  'Language Family': string
  'World Region': string
  'Primary Locations': string[] // Town or primary Neighborhood
  instanceIDs: number[]
}

export type LangLevelOptional = CensusFields &
  Partial<{
    Font: string
    'Font Image Alt': { url: string }[] // e.g. ASL, Mongolian
    'Global Speaker Total': number
    addlNeighborhoods: string[] // suuuper shakes mcgee
    Audio: string
    descriptionID: string
    // Used in "Language Profile" (aka Pre-Details), not Details
    langProfileDescripID: string
    Glottocode: string
    Macrocommunity: string[]
    Neighborhood: string[]
    Town: string[]
    Video: string
    'ISO 639-3': string
  }>

type InstanceLevelReqd = InternalUse & {
  County: string
  Language: string
  Size: 'Smallest' | 'Small' | 'Medium' | 'Large' | 'Largest'
  Status: Statuses
  sizeColor: string
  'Primary Location': string // Town or primary Neighborhood convenience
} & Omit<LangLevelReqd, 'name'>

type InstanceLevelOptional = LangLevelOptional & {
  'Additional Neighborhoods': string[]
  Description: string
  descriptionID: string
  Neighborhood: string // NYC-metro only
  Town: string
}

type CensusFields = {
  censusField?: string
  censusPretty?: string
  censusScope?: CensusScope
}

type CensusFieldPayload = {
  scope: CensusScope
  id: string
  pretty?: string
}

type CensusHighLow = { high: number; low: number } | undefined
type GeocodeMarkerSettings = {
  latitude: number
  longitude: number
  text: string
}

export type InitialMapToolsState = {
  autoZoomCensus: boolean
  geocodeMarkerText: GeocodeMarkerSettings | null
  showNeighbs: boolean
  showCounties: boolean
  geolocActive: boolean
  baseLayer: BaseLayer
  censusActiveField?: CensusFieldPayload
  censusHighLow?: CensusHighLow
}

export type MapToolsAction =
  | { type: 'CLEAR_CENSUS_FIELD' }
  | { type: 'SET_GEOCODE_LABEL'; payload: null | GeocodeMarkerSettings }
  | { type: 'SET_CENSUS_FIELD'; payload: CensusFieldPayload }
  | { type: 'SET_CENSUS_HIGH_LOW'; payload: CensusHighLow }
  | { type: 'SET_BASELAYER'; payload: BaseLayer }
  | { type: 'SET_GEOLOC_ACTIVE' }
  | { type: 'TOGGLE_NEIGHBORHOODS_LAYER'; payload?: boolean }
  | { type: 'TOGGLE_COUNTIES_LAYER'; payload?: boolean }
  | { type: 'TOGGLE_CENSUS_AUTO_ZOOM' }

export type MapToolsDispatch = React.Dispatch<MapToolsAction>

// Fields in the actual Airtable tables
export type LangLevelSchema = LangLevelOptional & LangLevelReqd
export type InstanceLevelSchema = InstanceLevelOptional & InstanceLevelReqd

// Corresponds with top-level "/Explore" route starting points. Used as a route
// parameter in Airtable queries in nested views, e.g. /Explore/Country/Egypt.
export type RouteableTableNames =
  | 'County'
  | 'Country'
  | 'Language'
  | 'Macrocommunity'
  | 'Neighborhood'
  | 'Town'
  | 'Language Family'
  | 'World Region'

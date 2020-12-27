// NOTE: parts of this file were adapted from an existing GitHub project with an
// MIT License, available here:
// https://github.com/Covid-Self-report-Tool/cov-self-report-frontend/blob/master/LICENSE

import { PreppedCensusLUTrow, CensusQueryID } from 'components/spatial/types'

export type PanelState = 'default' | 'maximized' | 'minimized'
export type LangSchemaCol = keyof LangRecordSchema

export type StoreAction =
  | { type: 'CLEAR_FILTERS'; payload: number }
  | { type: 'SET_LANG_LAYER_FEATURES'; payload: LangRecordSchema[] }
  | { type: 'SET_PANEL_STATE'; payload: PanelState }
  | { type: 'SET_SEL_FEAT_ATTRIBS'; payload: null | LangRecordSchema }

export type InitialState = {
  clearFilters: number
  langFeatures: LangRecordSchema[]
  langFeatsLenCache: number
  panelState: PanelState
  selFeatAttribs: null | LangRecordSchema
}

// ========================================================================== //
//
//    IF THIS PROJECT IS TO BE REUSED, THE CUSTOM PART BEGINS HERE AND
//    SHOULD ULTIMATELY BE MOVED TO A NEW FILE (e.g types.custom.ts). TRY TO
//    KEEP TRACK OF WHAT IS CUSTOM AND WHAT IS GENERIC WHENEVER POSSIBLE.
//
// ========================================================================== //

// Formerly "Type"
export type Statuses =
  | 'Historical'
  | 'Community'
  | 'Liturgical'
  | 'Residential'
  | 'Reviving'

// Aka user doesn't really see them
type InternalUse = {
  id: number // unique (ultimately)
  Latitude: number // nice convenience over geometry.coordinates
  Longitude: number // nice convenience over geometry.coordinates
}

// TODO: TS it up
type CommunitySize = 1 | 2 | 3 | 4 | 5

// TODO: consider separate file
// In the order that should be followed in Filters, Data/Results, and Details
export type LangRecordSchema = InternalUse & NonInternal
export type NonInternal = {
  'Font Image Alt'?: string // for images to use instead of fonts, e.g. ASL
  'Global Speaker Total'?: number // string in MB tileset b/c some blanks
  'ISO 639-3'?: string
  'Language Family': string
  'World Region': string
  Audio?: string // TODO: TS for URL?
  Country: string
  County: string
  Description: string
  Endonym: string // often same as English name, may be an http link to image
  Glottocode?: string
  Language: string
  Macrocommunity?: string
  Neighborhood?: string // NYC-metro only // TODO: make optional
  Size: CommunitySize
  Status: Statuses
  Town: string
  Video?: string // TODO: TS for URL?
}

// TODO: break out all types by Airtable table (instance vs. schema vs. lookup
// vs. data), and optional vs. required

// For Details, for now
export type DetailsSchema = NonInternal & {
  Country: string[]
  countryImg: { url: string }[]
  // Couldn't get this into string as an Airtable field:
  'Font Image Alt': { url: string }[]
  worldRegionColor: string
  'Language Description'?: string
  'Primary Neighborhood': string
  addlNeighborhoods?: string[] // suuuper shakes mcgee
  'Primary Location'?: string[] // Town or Primary Neighborhood (TODO: confirm)
  'Primary Locations'?: string[] // Town or Primary Neighborhood (TODO: confirm)
  // TODO: break out all the lang-level props into separate type
  instanceIDs?: number[]
  instanceDescrips?: string[]
} & CensusFields

// TODO: set up TableSchema. Should be very similar to Details.
// TODO: set up OmniboxSchema: iso, glotto, language, primaries, IDs

/**
 * MAP TOOLS CONTEXT (could not get all imports to work w/o dep cycle error)
 */
export type MapToolsAction =
  | { type: 'SET_LANG_CONFIG_VIA_SHEETS'; payload: LangConfig[] }
  | { type: 'SET_BOUNDARIES_VISIBLE'; payload: boolean }
  | { type: 'SET_GEOLOC_ACTIVE'; payload: boolean }
  | { type: 'CLEAR_CENSUS_FIELD' }
  | {
      type: 'SET_CENSUS_FIELD'
      payload?: string
      censusType: CensusQueryID
    }
  | {
      type: 'SET_CENSUS_FIELDS'
      payload: PreppedCensusLUTrow[]
      censusType: CensusQueryID
    }

export type MapToolsDispatch = React.Dispatch<MapToolsAction>

export type CensusFields = {
  'PUMA Field'?: string
  'Tract Field'?: string
  'Census Pretty'?: string // MATCH/INDEX convenience lookup
}

// NOTE: it's not actually ALL the cols, but most
export type LangConfig = Omit<
  LangRecordSchema,
  | 'County'
  | 'id'
  | 'Latitude'
  | 'Longitude'
  | 'Macrocommunity'
  | 'Neighborhood'
  | 'Size'
  | 'Status'
  | 'Town'
> &
  CensusFields & {
    'Global Speaker Total'?: string // MB has int, Google API string
    Font?: string
  }

export type InitialMapToolsState = {
  boundariesVisible: boolean
  geolocActive: boolean
  tractsField?: string
  pumaField?: string
  langConfigViaSheets: LangConfig[]
  censusDropDownFields: {
    tracts: PreppedCensusLUTrow[]
    puma: PreppedCensusLUTrow[]
  }
  censusActiveFields: {
    tracts: string
    puma: string
  }
}

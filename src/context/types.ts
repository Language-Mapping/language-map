// NOTE: parts of this file were adapted from an existing GitHub project with an
// MIT License, available here:
// https://github.com/Covid-Self-report-Tool/cov-self-report-frontend/blob/master/LICENSE

import { LayerPropsPlusMeta } from 'components/map/types'
import { LegendSwatch } from 'components/legend/types'

export type PanelState = 'default' | 'maximized' | 'minimized'

export type LegendSymbols = {
  [key: string]: Partial<LayerPropsPlusMeta>
}

export type LangSchemaCol = keyof LangRecordSchema

export type StoreAction =
  | { type: 'CLEAR_FILTERS'; payload: number }
  | { type: 'SET_LANG_LAYER_FEATURES'; payload: LangRecordSchema[] }
  | { type: 'SET_LANG_LAYER_LEGEND'; payload: LegendSwatch[] }
  | { type: 'SET_PANEL_STATE'; payload: PanelState }
  | { type: 'SET_SEL_FEAT_ATTRIBS'; payload: null | LangRecordSchema }

export type InitialState = {
  clearFilters: number
  langFeatures: LangRecordSchema[]
  langFeatsLenCache: number
  legendItems: LegendSwatch[]
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

export type WorldRegion =
  | 'Australia and New Zealand' // maybe issues w/ampersand
  | 'Caribbean'
  | 'Central America'
  | 'Central Asia'
  | 'Eastern Africa'
  | 'Eastern Asia'
  | 'Eastern Europe'
  | 'Melanesia'
  | 'Micronesia'
  | 'Middle Africa'
  | 'Northern Africa'
  | 'Northern America'
  | 'Northern Europe'
  | 'Polynesia'
  | 'South America'
  | 'Southeastern Asia'
  | 'Southern Africa'
  | 'Southern Asia'
  | 'Southern Europe'
  | 'Western Africa'
  | 'Western Asia'
  | 'Western Europe'

// Formerly "Type"
export type Statuses =
  | 'Historical'
  | 'Community'
  | 'Liturgical'
  | 'Residential'
  | 'Reviving'

// Aka user doesn't really see them
type InternalUse = {
  ID: number // unique (ultimately)
  Latitude: number // nice convenience over geometry.coordinates
  Longitude: number // nice convenience over geometry.coordinates
}

// TODO: TS it up
type CommunitySize = 1 | 2 | 3 | 4 | 5

// TODO: consider separate file
// In the order that should be followed in Filters, Data/Results, and Details
export type LangRecordSchema = InternalUse & {
  Language: string
  Endonym: string // often same as English name, may be an http link to image
  Neighborhoods: string | '' // NYC-metro only // TODO: make optional
  Size: CommunitySize
  Status: Statuses
  'World Region': WorldRegion
  Countries: string
  'Global Speaker Total'?: number // string in MB tileset b/c some blanks
  'Font Image Alt'?: string // for images to use instead of fonts, e.g. ASL
  'Language Family': string
  Description: string
  Video?: string // TODO: TS for URL?
  Audio?: string // TODO: TS for URL?
  Town: string
  County: string
  'ISO 639-3'?: string
  Glottocode?: string
}

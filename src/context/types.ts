// NOTE: parts of this file were adapted from an existing GitHub project with an
// MIT License, available here:
// https://github.com/Covid-Self-report-Tool/cov-self-report-frontend/blob/master/LICENSE
import { Color } from '@material-ui/lab/Alert'

import { MetadataGroup, Baselayer } from 'components/map/types'
import { LegendSwatch } from 'components/legend/types'

export type StoreAction =
  | { type: 'INIT_LANG_LAYER_FEATURES'; payload: LangRecordSchema[] }
  | { type: 'INIT_LANG_LAYER_LABEL_OPTIONS'; payload: string[] }
  | { type: 'INIT_LANG_LAYER_SYMB_OPTIONS'; payload: MetadataGroup }
  | { type: 'SET_BASELAYER'; payload: Baselayer }
  | { type: 'SET_LANG_FEAT_IDS'; payload: number[] }
  | { type: 'SET_LANG_LAYER_LABELS'; payload: string }
  | { type: 'SET_LANG_LAYER_LEGEND'; payload: LegendSwatch[] }
  | { type: 'SET_LANG_LAYER_SYMBOLOGY'; payload: string }
  | { type: 'SET_MAP_LOADED'; payload: boolean }
  | { type: 'SET_SEL_FEAT_ATTRIBS'; payload: null | LangRecordSchema }
  | { type: 'SHOW_SPLASH'; payload: boolean }
  | { type: 'TOGGLE_LAYER_VISIBILITY'; payload: keyof LayerVisibility }
  | { type: 'TOGGLE_UI_ALERT'; payload: AlertPayload }

export type InitialState = {
  activeLangLabelId: string
  activeLangSymbGroupId: string
  baselayer: Baselayer
  hasSeenSplash: boolean
  langFeatIDs: null | number[]
  langFeatures: LangRecordSchema[]
  langFeaturesCached: LangRecordSchema[]
  langLabels: string[]
  legendItems: LegendSwatch[]
  langSymbGroups: MetadataGroup
  layerVisibility: LayerVisibility // TODO: rm everywhere if not using
  mapLoaded: boolean
  selFeatAttribs: null | LangRecordSchema
  showSplash: boolean
  uiAlert: AlertPayload
}

export type AlertPayload = {
  open: boolean
  message?: string
  severity?: Color
  duration?: number | null // null means the error doesn't auto hide
}

// ========================================================================== //
//
//    IF THIS PROJECT IS TO BE REUSED, THE CUSTOM PART BEGINS HERE AND
//    SHOULD ULTIMATELY BE MOVED TO A NEW FILE (e.g types.custom.ts). TRY TO
//    KEEP TRACK OF WHAT IS CUSTOM AND WHAT IS GENERIC WHENEVER POSSIBLE.
//
// ========================================================================== //

// TODO: use `keyof` to restrict possible values appropriately in other
// components if needed. Remove this type if unused.
export type LayerVisibility = {
  languages: boolean
  neighborhoods: boolean
  counties: boolean
}

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

type CommunitySize = 1 | 2 | 3 | 4 | 5

// TODO: consider separate file
// In the order that should be followed in Filters, Data/Results, and Details
export type LangRecordSchema = InternalUse & {
  Language: string
  Endonym: string // often same as English name, may be an http link to image
  Neighborhoods: string | '' // NYC 'hoods only
  'Community Size': CommunitySize
  Status: Statuses
  'World Region': WorldRegion
  Countries: string // TODO: confirm required
  'Global Speaker Total'?: number // string in MB tileset b/c some blanks
  'Language Family': string
  Description: string // not all will be populated until end August
  Video?: string // TODO: TS for URL?
  Audio?: string // TODO: TS for URL?
  'Story Map'?: string // TODO: TS for URL?
  Town: string
  County: string
  'ISO 639-3'?: string
  Glottocode?: string
}

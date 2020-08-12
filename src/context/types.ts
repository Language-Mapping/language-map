// NOTE: parts of this file were adapted from an existing GitHub project with an
// MIT License, available here:
// https://github.com/Covid-Self-report-Tool/cov-self-report-frontend/blob/master/LICENSE
import { Color } from '@material-ui/lab/Alert'

import { MetadataGroup, Baselayer } from 'components/map/types'
import { LegendSwatch } from 'components/legend/types'

export type ActivePanelIndex = 0 | 1 | 2 | 3

export type StoreAction =
  | { type: 'INIT_LANG_LAYER_FEATURES'; payload: LangRecordSchema[] }
  | { type: 'INIT_LANG_LAYER_LABEL_OPTIONS'; payload: string[] }
  | { type: 'INIT_LANG_LAYER_SYMB_OPTIONS'; payload: MetadataGroup }
  | { type: 'SET_ACTIVE_PANEL_INDEX'; payload: ActivePanelIndex }
  | { type: 'SET_BASELAYER'; payload: Baselayer }
  | { type: 'SET_LANG_LAYER_LABELS'; payload: string }
  | { type: 'SET_LANG_LAYER_LEGEND'; payload: LegendSwatch[] }
  | { type: 'SET_LANG_LAYER_SYMBOLOGY'; payload: string }
  | { type: 'SET_SEL_FEAT_ATTRIBS'; payload: null | LangRecordSchema }
  | { type: 'SHOW_SPLASH'; payload: boolean }
  | { type: 'TOGGLE_LAYER_VISIBILITY'; payload: keyof LayerVisibility }
  | { type: 'TOGGLE_UI_ALERT'; payload: AlertPayload }

export type InitialState = {
  activeLangLabelId: string
  activeLangSymbGroupId: string
  activePanelIndex: ActivePanelIndex
  baselayer: Baselayer
  hasSeenSplash: boolean
  langFeatures: LangRecordSchema[]
  langFeaturesCached: LangRecordSchema[]
  langLabels: string[]
  langLegend: LegendSwatch[]
  langSymbGroups: MetadataGroup
  layerVisibility: LayerVisibility // TODO: rm everywhere if not using
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

type WorldRegion =
  | 'Australia and New Zealand'
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

type LangSchemaMedia = {
  Audio?: string // TODO: TS for URL?
  'Story Map'?: string // TODO: TS for URL?
  Video?: string // TODO: TS for URL?
}

type LangSchemaOptional = {
  Glottocode?: string
  'Global Speaker Total'?: number // TODO: why string in MB tileset?
  'ISO 639-3'?: string
  Neighborhoods?: string // NYC 'hoods only
  Countries?: string // TODO: confirm not required
} & LangSchemaMedia

// TODO: consider separate file
export type LangRecordSchema = {
  ID: number // unique (ultimately)
  County: string
  Description: string // not all will be populated until end August
  Language: string
  Endonym: string // may be same as English name
  Latitude: number // nice convenience over geometry.coordinates
  Longitude: number // nice convenience over geometry.coordinates
  Town: string
  'Community Size': 1 | 2 | 3 | 4 | 5
  'Language Family': string
  Type:
    | 'Historical'
    | 'Liturgical'
    | 'Institutional'
    | 'Residential'
    | 'Reviving'
  'World Region': WorldRegion
} & LangSchemaOptional

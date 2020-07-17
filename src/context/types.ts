// NOTE: parts of this file were adapted from an existing GitHub project with an
// MIT License, available here:
// https://github.com/Covid-Self-report-Tool/cov-self-report-frontend/blob/master/LICENSE
import React from 'react'
import { Color } from '@material-ui/lab/Alert'

import {
  MetadataGroupType,
  LegendSwatchType,
  BaselayerType,
} from 'components/map/types'

export type GlobalContextDispatchType = React.Dispatch<StoreActionType>
export type ActivePanelRouteType = '/' | '/display' | '/results' | '/details'

export type StoreActionType =
  | { type: 'SHOW_SPLASH'; payload: boolean }
  | { type: 'TOGGLE_UI_ALERT'; payload: AlertPayloadType }
  | { type: 'INIT_LANG_LAYER_FEATURES'; payload: LangRecordSchema[] }
  | { type: 'INIT_LANG_LAYER_LABEL_OPTIONS'; payload: string[] }
  | { type: 'INIT_LANG_LAYER_SYMB_OPTIONS'; payload: MetadataGroupType }
  | { type: 'SET_BASELAYER'; payload: BaselayerType }
  | { type: 'SET_LANG_LAYER_LABELS'; payload: string }
  | { type: 'SET_SEL_FEAT_DETAILS'; payload: Partial<LangRecordSchema> }
  | { type: 'SET_LANG_LAYER_LEGEND'; payload: LegendSwatchType[] }
  | { type: 'SET_LANG_LAYER_SYMBOLOGY'; payload: string }
  | { type: 'TOGGLE_LAYER_VISIBILITY'; payload: keyof LayerVisibilityTypes }

export type InitialStateType = {
  activeLangSymbGroupId: string
  activeLangLabelId: string
  baselayer: BaselayerType
  hasSeenSplash: boolean
  langFeatures: LangRecordSchema[]
  langLabels: string[]
  langLegend: LegendSwatchType[]
  langSymbGroups: MetadataGroupType
  layerVisibility: LayerVisibilityTypes
  selFeatDetails: Partial<LangRecordSchema>
  showSplash: boolean
  uiAlert: AlertPayloadType
}

export type AlertPayloadType = {
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
export type LayerVisibilityTypes = {
  languages: boolean
  neighborhoods: boolean
  counties: boolean
}

// TODO: separate file
export type LangRecordSchema = {
  County: string
  Description: string // not all will be populated until August
  ID: string // unique, #### format. TODO: consider TS validation?
  Language: string
  Latitude: number // also in `geometry.coordinates` maybe? If so, remove?
  Longitude: number // also in `geometry.coordinates` maybe? If so, remove?
  Town: string
  'Local Size': 1 | 2 | 3 | 4 | 5
  'Top-Level Family': string
  'Local Status':
    | 'Historical'
    | 'Liturgical'
    | 'Non-Residential'
    | 'Residential'
    | 'Reviving'
  // Can/should `Region` be typed?
  Region:
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
    | 'Oceania'
    | 'Polynesia'
    | 'South America'
    | 'Southeastern Asia'
    | 'Southern Africa'
    | 'Southern America'
    | 'Southern Asia'
    | 'Southern Europe'
    | 'Western Africa'
    | 'Western Asia'
    | 'Western Europe'
  // END REQUIRED FIELDS, BEGIN OPTIONAL
  Glottocode?: string
  'ELA Video'?: string // TODO: TS for URL?
  'Global Speaker Total'?: number // TODO: why string in MB tileset?
  'ISO 639-3'?: string
  'Language Endonym'?: string // blank if same as English name
  'NYC Neighborhood'?: string // eventually no `NYC`
  'Primary Country'?: string // TODO: confirm not required
  'Secondary Country'?: string
  AES?:
    | 'moribund'
    | 'nearly extinct'
    | 'not endangered'
    | 'reviving'
    | 'shifting'
    | 'threatened'
  'Additional Neighborhoods'?: string // parsed by `|||` maybe?
  'ELA Audio'?: string // TODO: TS for URL?
  'ELA Story Map'?: string // TODO: TS for URL?
}

// About page. Could be separate file
export type WpApiPageResponseType = {
  title: {
    rendered: string
  }
  content: {
    rendered: string
  }
}

export type AboutPageStateType = {
  title: string | null
  content: string | null
}

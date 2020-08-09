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
export type ActivePanelIndexType = 0 | 1 | 2 | 3

export type StoreActionType =
  | { type: 'INIT_LANG_LAYER_FEATURES'; payload: LangRecordSchema[] }
  | { type: 'INIT_LANG_LAYER_LABEL_OPTIONS'; payload: string[] }
  | { type: 'INIT_LANG_LAYER_SYMB_OPTIONS'; payload: MetadataGroupType }
  | { type: 'SET_ACTIVE_PANEL_INDEX'; payload: ActivePanelIndexType }
  | { type: 'SET_BASELAYER'; payload: BaselayerType }
  | { type: 'SET_LANG_LAYER_LABELS'; payload: string }
  | { type: 'SET_LANG_LAYER_LEGEND'; payload: LegendSwatchType[] }
  | { type: 'SET_LANG_LAYER_SYMBOLOGY'; payload: string }
  | { type: 'SET_SEL_FEAT_ATTRIBS'; payload: null | LangRecordSchema }
  | { type: 'SHOW_SPLASH'; payload: boolean }
  | { type: 'TOGGLE_LAYER_VISIBILITY'; payload: keyof LayerVisibilityTypes }
  | { type: 'TOGGLE_UI_ALERT'; payload: AlertPayloadType }

export type InitialStateType = {
  activeLangLabelId: string
  activeLangSymbGroupId: string
  activePanelIndex: ActivePanelIndexType
  baselayer: BaselayerType
  hasSeenSplash: boolean
  langFeatures: LangRecordSchema[]
  langFeaturesCached: LangRecordSchema[]
  langLabels: string[]
  langLegend: LegendSwatchType[]
  langSymbGroups: MetadataGroupType
  layerVisibility: LayerVisibilityTypes
  selFeatAttrbs: null | LangRecordSchema
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
  ID: number // unique
  County: string
  Description: string // not all will be populated until August
  Language: string
  Endonym: string // may be same as English name
  Latitude: number // keep it (nice convenience over geometry.coordinates)
  Longitude: number // keep it (nice convenience over geometry.coordinates)
  Town: string
  'Community Size': 1 | 2 | 3 | 4 | 5
  'Language Family': string
  Type:
    | 'Historical'
    | 'Liturgical'
    | 'Institutional'
    | 'Residential'
    | 'Reviving'
  'World Region':
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
  // END REQUIRED FIELDS, BEGIN OPTIONAL
  Glottocode?: string
  'Global Speaker Total'?: number // TODO: why string in MB tileset?
  'ISO 639-3'?: string
  Neighborhood?: string // NYC 'hoods only
  'Additional Neighborhoods'?: string // parsed by `|||` maybe?
  'Primary Country'?: string // TODO: confirm not required
  'Secondary Country'?: string
  // BEGIN MEDIA
  Audio?: string // TODO: TS for URL?
  'Story Map'?: string // TODO: TS for URL?
  Video?: string // TODO: TS for URL?
  // END MEDIA
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

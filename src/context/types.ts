// NOTE: parts of this file were adapted from an existing GitHub project with an
// MIT License, available here:
// https://github.com/Covid-Self-report-Tool/cov-self-report-frontend/blob/master/LICENSE
import React from 'react'
import { Color } from '@material-ui/lab/Alert'

export type GlobalContextDispatchType = React.Dispatch<StoreActionType>

export type StoreActionType =
  | { type: 'SHOW_SPLASH'; payload: boolean }
  | { type: 'TOGGLE_LAYER_VISIBILITY'; payload: keyof LayerVisibilityTypes }
  | {
      type: 'TOGGLE_UI_ALERT'
      payload: AlertPayloadType
    }
  | { type: 'SET_LANG_LAYER_FEATURES'; payload: LangRecordSchema[] }
  | {
      type: 'SET_LANG_LAYER_SYMBOLOGY'
      payload: keyof LangSymbStyles
    }

export type InitialStateType = {
  activeLangSymbKey: keyof LangSymbStyles
  langFeatures: LangRecordSchema[]
  hasSeenSplash: boolean
  layerVisibility: LayerVisibilityTypes
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
// components if needed
export type LayerVisibilityTypes = {
  languages: boolean
  neighborhoods: boolean
  counties: boolean
}

export type LangSymbStyles = {
  default: {
    todo: true
    task: 'Wire this up with MB layer styles'
  }
}

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

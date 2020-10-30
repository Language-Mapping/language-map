import { LangRecordSchema } from '../../context/types'

export type RouteLocation =
  | '/'
  | '/details'
  | '/table'
  | '/about'
  | '/help'
  | '/grid'

// TODO: Careful! Consolidate w/HistoryState
export type LocState = {
  focusField?: keyof LangRecordSchema
  selFeatID?: number // should this be string?
}

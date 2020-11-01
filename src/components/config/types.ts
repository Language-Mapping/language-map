import { LangRecordSchema } from '../../context/types'

export type RouteLocation =
  | '/'
  | '/details'
  | '/table'
  | '/about'
  | '/help'
  | '/Explore'
  | '/Explore/:field'
  | '/Explore/:field/:value'
// TODO: ^^^^ figure out why it's not actually checking

// TODO: Careful! Consolidate w/HistoryState
export type LocState = {
  focusField?: keyof LangRecordSchema
  selFeatID?: number // should this be string?
}

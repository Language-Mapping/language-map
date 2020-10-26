import { LangRecordSchema } from '../../context/types'

export type RouteLocation = '/' | '/details' | '/table' | '/about' | '/help'

export type LocState = {
  focusField?: keyof LangRecordSchema
  selFeatID?: number // should this be string?
}

import { StoreAction, InitialState } from './types'

export const reducer = (
  state: InitialState,
  action: StoreAction
): InitialState => {
  switch (action.type) {
    case 'CLEAR_FILTERS':
      return {
        ...state,
        clearFilters: action.payload,
      }
    case 'SET_LANG_LAYER_FEATURES':
      return {
        ...state,
        langFeatures: action.payload,
        langFeatsLenCache: state.langFeatsLenCache || action.payload.length,
      }
    case 'SET_FILTER_HAS_RUN':
      return {
        ...state,
        filterHasRun: true,
      }
    default:
      return state
  }
}

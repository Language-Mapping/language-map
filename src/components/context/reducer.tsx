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
        // Handy for future reference without caching all the features
        langFeatsLenCache: state.langFeatsLenCache || action.payload.length,
      }
    case 'SET_PANEL_STATE':
      return {
        ...state,
        panelState: action.payload,
      }
    default:
      return state
  }
}

import { StoreAction, InitialState } from 'context/types'

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
    case 'SET_LANG_LAYER_LABELS':
      return {
        ...state,
        activeLabelID: action.payload,
      }
    case 'SET_LANG_LAYER_LEGEND':
      return {
        ...state,
        legendItems: action.payload,
      }
    case 'SET_LANG_LAYER_SYMBOLOGY':
      return {
        ...state,
        activeSymbGroupID: action.payload,
      }
    case 'SET_SEL_FEAT_ATTRIBS':
      return {
        ...state,
        selFeatAttribs: action.payload,
      }
    case 'SET_PANEL_STATE':
      return {
        ...state,
        panelState: action.payload,
      }
    case 'TOGGLE_BOUNDARIES_LAYER':
      return {
        ...state,
        boundariesLayersVisible: !state.boundariesLayersVisible,
      }
    default:
      return state
  }
}

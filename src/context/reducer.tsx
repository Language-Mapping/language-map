import { StoreAction, InitialState } from 'context/types'

export const reducer = (
  state: InitialState,
  action: StoreAction
): InitialState => {
  switch (action.type) {
    case 'INIT_LANG_LAYER_FEATURES':
      return {
        ...state,
        langFeatures: action.payload,
        langFeaturesCached: action.payload, // for easy resets later
      }
    case 'INIT_LANG_LAYER_LABEL_OPTIONS':
      return {
        ...state,
        langLabels: action.payload,
      }
    case 'INIT_LANG_LAYER_SYMB_OPTIONS':
      return {
        ...state,
        langSymbGroups: action.payload,
      }
    case 'INIT_LEGEND_SYMBOLS':
      return {
        ...state,
        legendSymbols: action.payload,
      }
    case 'SET_BASELAYER':
      return {
        ...state,
        baselayer: action.payload,
      }
    case 'SET_LANG_FEAT_IDS':
      return {
        ...state,
        langFeatIDs: action.payload,
      }
    case 'SET_LANG_LAYER_LABELS':
      return {
        ...state,
        activeLangLabelId: action.payload,
      }
    case 'SET_LANG_LAYER_LEGEND':
      return {
        ...state,
        legendItems: action.payload,
      }
    case 'SET_LANG_LAYER_SYMBOLOGY':
      return {
        ...state,
        activeLangSymbGroupId: action.payload,
      }
    case 'SET_SEL_FEAT_ATTRIBS':
      return {
        ...state,
        selFeatAttribs: action.payload,
      }
    case 'SET_MAP_LOADED':
      return {
        ...state,
        mapLoaded: action.payload,
      }
    case 'SET_PANEL_STATE':
      return {
        ...state,
        panelState: action.payload,
      }
    // TODO: wire up
    case 'TOGGLE_UI_ALERT':
      return {
        ...state,
        uiAlert: {
          ...state.uiAlert,
          ...action.payload,
        },
      }
    case 'TOGGLE_OFF_CANVAS_NAV':
      return {
        ...state,
        offCanvasNavOpen: !state.offCanvasNavOpen,
      }
    default:
      return state
  }
}

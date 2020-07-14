import {
  StoreActionType as GlobalActionType,
  InitialStateType,
} from 'context/types'

export const reducer = (
  state: InitialStateType,
  action: GlobalActionType
): InitialStateType => {
  switch (action.type) {
    // TODO: fix this. So weird!
    case 'SET_BASELAYER':
      return {
        ...state,
        baselayer: action.payload,
      }
    case 'SET_LANG_LAYER_FEATURES':
      return {
        ...state,
        langFeatures: action.payload,
      }
    case 'SET_LANG_LAYER_SYMBOLOGY':
      return {
        ...state,
        activeLangSymbKey: action.payload,
      }
    case 'SET_LANG_LAYER_SYMB_OPTIONS':
      return {
        ...state,
        langSymbOptions: action.payload,
      }
    case 'TOGGLE_UI_ALERT':
      return {
        ...state,
        uiAlert: {
          ...state.uiAlert,
          ...action.payload,
        },
      }
    case 'TOGGLE_LAYER_VISIBILITY':
      return {
        ...state,
        layerVisibility: {
          ...state.layerVisibility,
          [action.payload]: !state.layerVisibility[action.payload],
        },
      }
    case 'SHOW_SPLASH':
      if (action.payload === true) {
        localStorage.setItem('hasSeenSplash', 'true')

        return {
          ...state,
          showSplash: action.payload,
          hasSeenSplash: true,
        }
      }

      return {
        ...state,
        showSplash: action.payload,
      }
    default:
      return state
  }
}

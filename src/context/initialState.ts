import { InitialState } from 'context/types'
import fullLangStyle from '../components/map/config.lang-style'

// TODO: consider separate file
const legendSymbols = fullLangStyle.reduce((all, thisOne) => {
  const { paint, type, layout } = thisOne

  return {
    ...all,
    [thisOne.id as string]: {
      paint,
      type,
      layout,
    },
  }
}, {})

export const initialState = {
  activeLangLabelId: '',
  activeLangSymbGroupId: 'World Region',
  baselayer: 'light',
  boundariesLayersVisible: false,
  langFeatsLenCache: 0,
  langFeatures: [],
  legendItems: [],
  legendSymbols,
  mapLoaded: false,
  offCanvasNavOpen: false,
  panelState: 'default',
  selFeatAttribs: null,
  uiAlert: { message: '', open: false, severity: 'success' },
} as InitialState

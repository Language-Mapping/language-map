import { InitialState } from 'context/types'

export const initialState = {
  activeLangLabelId: '',
  activeLangSymbGroupId: 'World Region',
  baselayer: 'light',
  boundariesLayersVisible: false,
  langFeatsLenCache: 0,
  langFeatures: [],
  legendItems: [],
  legendSymbols: {},
  mapLoaded: false,
  offCanvasNavOpen: false,
  panelState: 'default',
  selFeatAttribs: null,
  uiAlert: { message: '', open: false, severity: 'success' },
} as InitialState

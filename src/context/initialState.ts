import { InitialState } from 'context/types'

// Somewhat project-specific, consider putting in separate file
const initialMapStates = {
  activeLangLabelId: '',
  activeLangSymbGroupId: '',
  baselayer: 'light',
  langFeatures: [],
  langFeatsLenCache: 0,
  langLabels: [],
  langSymbGroups: {},
  legendItems: [],
  legendSymbols: {},
  boundariesLayersVisible: false,
  panelState: 'default',
}

export const initialState = {
  mapLoaded: false,
  offCanvasNavOpen: false,
  selFeatAttribs: null,
  uiAlert: {
    open: false,
    message: '',
    severity: 'success',
  },
  ...initialMapStates,
} as InitialState

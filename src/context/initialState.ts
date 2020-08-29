import { InitialState } from 'context/types'

// Somewhat project-specific, consider putting in separate file
const initialMapStates = {
  activeLangSymbGroupId: '',
  activeLangLabelId: '',
  baselayer: 'light',
  panelState: 'default',
  langFeatIDs: null,
  langFeatures: [],
  langFeaturesCached: [],
  langLabels: [],
  legendItems: [],
  langSymbGroups: {},
  layerVisibility: {
    languages: true,
    counties: false,
    neighborhoods: false,
  },
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

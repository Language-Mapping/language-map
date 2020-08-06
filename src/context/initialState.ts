import { InitialStateType } from 'context/types'

// Somewhat project-specific, consider putting in separate file
const initialMapStates = {
  activeLangSymbGroupId: '',
  activeLangLabelId: '',
  baselayer: 'light',
  langFeatures: [],
  langFeaturesCached: [],
  langLabels: [],
  langLegend: [],
  langSymbGroups: {},
  layerVisibility: {
    languages: true,
    counties: false,
    neighborhoods: false,
  },
}

export const initialState = {
  selFeatAttrbs: null,
  showSplash: false,
  hasSeenSplash: !!localStorage.getItem('hasSeenSplash') || false,
  uiAlert: {
    open: false,
    message: '',
    severity: 'success',
  },
  ...initialMapStates,
} as InitialStateType

import { InitialStateType } from 'context/types'

// Somewhat project-specific, consider putting in separate file
const initialMapStates = {
  activeLangSymbGroupId: '',
  activeLangLabelId: '',
  baselayer: 'dark',
  langFeatures: [],
  langLegend: [],
  langSymbGroups: {},
  layerVisibility: {
    languages: true,
    counties: false,
    neighborhoods: false,
  },
}

export const initialState = {
  showSplash: false,
  hasSeenSplash: !!localStorage.getItem('hasSeenSplash') || false,
  uiAlert: {
    open: false,
    message: '',
    severity: 'success',
  },
  ...initialMapStates,
} as InitialStateType

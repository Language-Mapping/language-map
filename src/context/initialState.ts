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
  activeLabelID: '',
  activeSymbGroupID: 'World Region',
  boundariesLayersVisible: false,
  clearFilters: 0,
  langFeatsLenCache: 0,
  langFeatures: [],
  legendItems: [],
  legendSymbols,
  mapLoaded: false,
  offCanvasNavOpen: false,
  panelState: 'default',
  selFeatAttribs: null,
} as InitialState

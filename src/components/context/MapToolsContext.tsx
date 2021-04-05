import React, { FC } from 'react'

import * as Types from './types'

// TODO: rm if not using
// const isLocalDev = window?.location.hostname === 'lampel-2.local'

const initialState = {
  autoZoomCensus: true,
  geolocActive: false,
  showNeighbs: false,
  showCounties: false,
  // baseLayer: isLocalDev ? 'none' : 'light', // TODO: default to none in dev
  baseLayer: 'light',
} as Types.InitialMapToolsState

const MapToolsContext = React.createContext<
  Types.InitialMapToolsState | undefined
>(undefined)
const MapToolsDispatchContext = React.createContext<
  Types.MapToolsDispatch | undefined
>(undefined)

function reducer(
  state: Types.InitialMapToolsState,
  action: Types.MapToolsAction
) {
  switch (action.type) {
    case 'SET_BASELAYER':
      return { ...state, baseLayer: action.payload }
    case 'TOGGLE_CENSUS_AUTO_ZOOM':
      return { ...state, autoZoomCensus: !state.autoZoomCensus }
    case 'TOGGLE_NEIGHBORHOODS_LAYER':
      return {
        ...state,
        showNeighbs:
          action.payload === undefined ? !state.showNeighbs : action.payload,
      }
    case 'TOGGLE_COUNTIES_LAYER':
      return {
        ...state,
        showCounties:
          action.payload === undefined ? !state.showCounties : action.payload,
      }
    case 'SET_GEOLOC_ACTIVE':
      return { ...state, geolocActive: !state.geolocActive }
    case 'SET_CENSUS_FIELD':
      return {
        ...state,
        censusActiveField: action.payload,
      }
    case 'SET_CENSUS_HIGH_LOW':
      return {
        ...state,
        censusHighLow: action.payload,
      }
    case 'CLEAR_CENSUS_FIELD':
      return { ...state, censusActiveField: undefined }
    default: {
      return state
    }
  }
}

export const MapToolsProvider: FC = (props) => {
  const { children } = props
  const [state, dispatch] = React.useReducer(reducer, initialState)

  return (
    <MapToolsContext.Provider value={state}>
      <MapToolsDispatchContext.Provider value={dispatch}>
        {children}
      </MapToolsDispatchContext.Provider>
    </MapToolsContext.Provider>
  )
}

function useMapToolsState(): Types.InitialMapToolsState {
  const context = React.useContext(MapToolsContext)

  if (context === undefined) {
    throw new Error('useMapToolsState must be used within a CountProvider')
  }

  return context
}

function useMapToolsDispatch(): Types.MapToolsDispatch {
  const context = React.useContext(MapToolsDispatchContext)

  if (context === undefined) {
    throw new Error('useMapToolsDispatch must be used within a CountProvider')
  }

  return context
}

// NOTE: not using quite the same pattern as in `GlobalContext`, but it's pretty
// close and either one is easy to use once it's set up. For this file in
// particular, followed this guide to break out the global context into two
// components since there were too many places re-rendering on the
// (unnecessarily) global changes:
// https://kentcdodds.com/blog/how-to-use-react-context-effectively
export { useMapToolsState, useMapToolsDispatch }

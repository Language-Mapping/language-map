import React, { FC } from 'react'

import * as Types from './types'

const initialState = {
  autoZoomCensus: true,
  boundariesVisible: false,
  geolocActive: false,
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
    case 'TOGGLE_CENSUS_AUTO_ZOOM':
      return { ...state, autoZoomCensus: !state.autoZoomCensus }
    case 'SET_BOUNDARIES_VISIBLE':
      return { ...state, boundariesVisible: action.payload }
    case 'SET_GEOLOC_ACTIVE':
      return { ...state, geolocActive: action.payload }
    case 'SET_CENSUS_FIELD':
      return {
        ...state,
        censusActiveField: action.payload,
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
    throw new Error('useCountState must be used within a CountProvider')
  }

  return context
}

function useMapToolsDispatch(): Types.MapToolsDispatch {
  const context = React.useContext(MapToolsDispatchContext)

  if (context === undefined) {
    throw new Error('useCountDispatch must be used within a CountProvider')
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

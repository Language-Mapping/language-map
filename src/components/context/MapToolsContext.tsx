import React, { FC } from 'react'

import { InterpRateOfChange } from 'components/map/types'

type MapToolsAction =
  | { type: 'SET_BOUNDARIES_VISIBLE'; payload: boolean }
  | { type: 'SET_GEOLOC_ACTIVE'; payload: boolean }
  | { type: 'SET_CENSUS_FIELD'; payload: string }
  | { type: 'SET_CENSUS_RATE_OF_CHANGE'; payload: InterpRateOfChange }

type Dispatch = React.Dispatch<MapToolsAction>

type InitialState = {
  boundariesVisible: boolean
  geolocActive: boolean
  censusRateOfChange: InterpRateOfChange
  censusField?: string
}

const initialState = {
  boundariesVisible: false,
  geolocActive: false,
  censusRateOfChange: 'linear',
} as InitialState

const MapToolsContext = React.createContext<InitialState | undefined>(undefined)
const MapToolsDispatchContext = React.createContext<Dispatch | undefined>(
  undefined
)

function reducer(state: InitialState, action: MapToolsAction) {
  switch (action.type) {
    case 'SET_BOUNDARIES_VISIBLE':
      return {
        ...state,
        boundariesVisible: action.payload,
      }
    case 'SET_GEOLOC_ACTIVE':
      return {
        ...state,
        geolocActive: action.payload,
      }
    case 'SET_CENSUS_FIELD':
      return {
        ...state,
        censusField: action.payload,
      }
    case 'SET_CENSUS_RATE_OF_CHANGE':
      return {
        ...state,
        censusRateOfChange: action.payload,
      }
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

function useMapToolsState(): InitialState {
  const context = React.useContext(MapToolsContext)

  if (context === undefined) {
    throw new Error('useCountState must be used within a CountProvider')
  }

  return context
}

function useMapToolsDispatch(): Dispatch {
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

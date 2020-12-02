import React, { FC } from 'react'

import { PreppedCensusLUTrow } from 'components/spatial/types'

type MapToolsAction =
  | { type: 'SET_BOUNDARIES_VISIBLE'; payload: boolean }
  | { type: 'SET_GEOLOC_ACTIVE'; payload: boolean }
  | { type: 'SET_TRACTS_FIELD'; payload: string }
  | { type: 'SET_PUMA_FIELD'; payload: string }
  | { type: 'SET_TRACTS_FIELDS'; payload: PreppedCensusLUTrow[] }
  | { type: 'SET_PUMA_FIELDS'; payload: PreppedCensusLUTrow[] }

type Dispatch = React.Dispatch<MapToolsAction>

export type InitialMapToolsState = {
  boundariesVisible: boolean
  geolocActive: boolean
  tractsField?: string
  pumaField?: string
  tractsFields: PreppedCensusLUTrow[]
  pumaFields: PreppedCensusLUTrow[]
  censusDropDownFields: {
    tracts: PreppedCensusLUTrow[]
    puma: PreppedCensusLUTrow[]
  }
  censusActiveFields: {
    tracts?: string
    puma?: string
  }
}

const initialState = {
  boundariesVisible: false,
  geolocActive: false,
  tractsFields: [],
  pumaFields: [],
  censusDropDownFields: {
    tracts: [],
    puma: [],
  },
  censusActiveFields: {},
} as InitialMapToolsState

const MapToolsContext = React.createContext<InitialMapToolsState | undefined>(
  undefined
)
const MapToolsDispatchContext = React.createContext<Dispatch | undefined>(
  undefined
)

function reducer(state: InitialMapToolsState, action: MapToolsAction) {
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
    case 'SET_TRACTS_FIELD':
      return {
        ...state,
        tractsField: action.payload,
      }
    case 'SET_PUMA_FIELD':
      return {
        ...state,
        pumaField: action.payload,
      }
    case 'SET_TRACTS_FIELDS':
      return {
        ...state,
        tractsFields: action.payload,
      }
    case 'SET_PUMA_FIELDS':
      return {
        ...state,
        pumaFields: action.payload,
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

function useMapToolsState(): InitialMapToolsState {
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

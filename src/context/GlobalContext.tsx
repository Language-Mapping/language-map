// NOTE: some of this file was adapted from an existing GitHub project with an
// MIT License, available here:
// https://github.com/Covid-Self-report-Tool/cov-self-report-frontend/blob/master/LICENSE
import React, { useReducer, createContext, FC } from 'react'

import { reducer } from './reducer'
import { StoreAction, InitialState } from './types'

type Context = {
  state: InitialState
  dispatch: React.Dispatch<StoreAction>
}

const initialState = {
  clearFilters: 0,
  langFeatsLenCache: 0,
  langFeatures: [],
  panelState: 'default',
  selFeatAttribs: null,
} as InitialState

// Good article on setting all this up:
// https://www.simplethread.com/cant-replace-redux-with-hooks/
export const GlobalContext = createContext<Context>({
  state: initialState,
  dispatch: () => null,
})

// TODO: this if it makes sense to:
// https://dev.to/stephencweiss/usereducer-with-typescript-2kf

export const GlobalProvider: FC = (props) => {
  const { children } = props
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <GlobalContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}

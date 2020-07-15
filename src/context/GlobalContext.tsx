// NOTE: some of this file was adapted from an existing GitHub project with an
// MIT License, available here:
// https://github.com/Covid-Self-report-Tool/cov-self-report-frontend/blob/master/LICENSE
import React, { useReducer, createContext, FC } from 'react'

// TODO: once content is ready (WP API?), use `react-query` lib to cache on load
// and run the fetch in a `useEffect` inside `GlobalProvider`.
import { reducer } from './reducer'
import { initialState } from './initialState'
import { StoreActionType, InitialStateType } from './types'

type ContextType = {
  state: InitialStateType
  dispatch: React.Dispatch<StoreActionType>
}

// Good article on setting all this up:
// https://www.simplethread.com/cant-replace-redux-with-hooks/
export const GlobalContext = createContext<ContextType>({
  state: initialState,
  dispatch: () => null,
})

type GlobalProviderType = {
  children: React.ReactNode
}

// TODO: this if it makes sense to:
// https://dev.to/stephencweiss/usereducer-with-typescript-2kf

export const GlobalProvider: FC<GlobalProviderType> = ({ children }) => {
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

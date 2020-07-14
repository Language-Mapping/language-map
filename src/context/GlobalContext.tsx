// NOTE: some of this file was adapted from an existing GitHub project with an
// MIT License, available here:
// https://github.com/Covid-Self-report-Tool/cov-self-report-frontend/blob/master/LICENSE
import React, { useReducer, createContext, FC } from 'react'

// TODO: once content is ready (WP API?), use `react-query` lib to cache on load
// and run the fetch in a `useEffect` inside `GlobalProvider`.
import { InitialStateType } from 'context/types'
import { reducer } from './reducer'

export const initialState = {
  showSplash: false,
  hasSeenSplash: !!localStorage.getItem('hasSeenSplash') || false,
  baselayer: 'dark',
  uiAlert: {
    open: false,
    message: '',
    severity: 'success',
  },
  // PROJECT-SPECIFIC, SHOULD GO IN CUSTOM FILE
  activeLangSymbKey: 'default', // TODO: correspond with a style
  langFeatures: [],
  langSymbOptions: [],
  layerVisibility: {
    languages: true,
    counties: false,
    neighborhoods: false,
  },
  langLayerProps: {
    id: 'languages',
    type: 'circle',
    paint: {},
  },
  // END PROJECT-SPECIFIC
} as InitialStateType

// Good article on setting all this up:
// https://www.simplethread.com/cant-replace-redux-with-hooks/
// TODO: fix the `any`
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const GlobalContext = createContext<{ state: any; dispatch: any }>({
  state: null,
  dispatch: null,
})

type GlobalProviderType = {
  children: React.ReactNode
}

export const GlobalProvider: FC<GlobalProviderType> = ({ children }) => {
  // TODO: stop taking the easy way out:
  // https://dev.to/stephencweiss/usereducer-with-typescript-2kf
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
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

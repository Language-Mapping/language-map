// NOTE: some of this file was adapted from an existing GitHub project with an
// MIT License, available here:
// https://github.com/Covid-Self-report-Tool/cov-self-report-frontend/blob/master/LICENSE
import React, { useReducer, createContext, FC } from 'react'

// TODO: once content is ready (WP API?), use `react-query` lib to cache on load
// and run the fetch in a `useEffect` inside `GlobalProvider`.
import {
  StoreActionType as GlobalActionType,
  InitialStateType,
} from 'context/types'

export const initialState = {
  activeLangSymbKey: 'default', // TODO: correspond with a style
  showSplash: false,
  loginSignupModal: null,
  hasSeenSplash: !!localStorage.getItem('hasSeenSplash') || false,
  uiAlert: {
    open: false,
    message: '',
    severity: 'success',
  },
  // PROJECT-SPECIFIC, SHOULD GO IN CUSTOM FILE
  layerVisibility: {
    languages: true,
    //  counties: false,
    //  neighborhoods: false,
  },
  // END PROJECT-SPECIFIC
}

// TODO: give search form its own reducer?
// const searchFormReducer = (
//   state: InitFormStateType,
//   action: FormActionType
// ): InitFormStateType => {
//   switch (action.type) {
//     case 'RESET_SEARCH_FORM':
//       return {
//         ...initSearchFormState,
//       }
//   }
// }

const reducer = (
  state: InitialStateType,
  action: GlobalActionType
): InitialStateType => {
  switch (action.type) {
    case 'SET_LANG_LAYER_SYMBOLOGY':
      return {
        ...state,
        activeLangSymbKey: action.payload,
      }
    case 'TOGGLE_UI_ALERT':
      return {
        ...state,
        uiAlert: {
          ...state.uiAlert,
          ...action.payload,
        },
      }
    case 'TOGGLE_LAYER_VISIBILITY':
      return {
        ...state,
        layerVisibility: {
          ...state.layerVisibility,
          [action.payload]: !state.layerVisibility[action.payload],
        },
      }
    case 'SHOW_SPLASH':
      if (action.payload === true) {
        localStorage.setItem('hasSeenSplash', 'true')
        return {
          ...state,
          showSplash: action.payload,
          hasSeenSplash: true,
        }
      }
      return {
        ...state,
        showSplash: action.payload,
      }
    default:
      return state
  }
}

// Good article on setting all this up:
// https://www.simplethread.com/cant-replace-redux-with-hooks/
export const GlobalContext = createContext<{ state: any; dispatch: any }>({
  state: null,
  dispatch: null,
})

type GlobalProviderType = {
  children: React.ReactNode
}

export const GlobalProvider: FC<GlobalProviderType> = ({ children }) => {
  // @ts-ignore
  const [state, dispatch] = useReducer(reducer, initialState)

  // TODO: install and wire up `react-query` to grab About page content
  // useEffect(() => { bootstrapApp() }, [])

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  )
}

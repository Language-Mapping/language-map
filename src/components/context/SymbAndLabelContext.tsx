import React, { FC } from 'react'

import { LangSchemaCol } from './types'

type Dispatch = React.Dispatch<Action>
type InitialState = {
  activeLabelID: LangSchemaCol | '' | 'None'
  activeSymbGroupID: LangSchemaCol | '' | 'None'
  hideLangPoints: boolean
}

export type Action =
  | { type: 'TOGGLE_LANG_POINTS' }
  | { type: 'SET_LANG_LAYER_LABELS'; payload: LangSchemaCol | '' }
  | { type: 'SET_LANG_LAYER_SYMBOLOGY'; payload: LangSchemaCol }

const initialState = {
  activeLabelID: '',
  activeSymbGroupID: 'World Region',
  hideLangPoints: false,
} as InitialState

const SymbAndLabelContext = React.createContext<InitialState | undefined>(
  undefined
)
const SymbLabelDispatchContext = React.createContext<Dispatch | undefined>(
  undefined
)

function reducer(state: InitialState, action: Action) {
  switch (action.type) {
    case 'TOGGLE_LANG_POINTS':
      return {
        ...state,
        hideLangPoints: !state.hideLangPoints,
      }
    case 'SET_LANG_LAYER_LABELS':
      return {
        ...state,
        activeLabelID: action.payload,
      }
    case 'SET_LANG_LAYER_SYMBOLOGY':
      return {
        ...state,
        activeSymbGroupID: action.payload,
      }
    default: {
      return state
    }
  }
}

export const SymbAndLabelProvider: FC = (props) => {
  const { children } = props
  const [state, dispatch] = React.useReducer(reducer, initialState)

  return (
    <SymbAndLabelContext.Provider value={state}>
      <SymbLabelDispatchContext.Provider value={dispatch}>
        {children}
      </SymbLabelDispatchContext.Provider>
    </SymbAndLabelContext.Provider>
  )
}

function useSymbAndLabelState(): InitialState {
  const context = React.useContext(SymbAndLabelContext)

  if (context === undefined) {
    throw new Error('useCountState must be used within a CountProvider')
  }

  // TODO: destructure the return
  return context
}

function useLabelAndSymbDispatch(): Dispatch {
  const context = React.useContext(SymbLabelDispatchContext)

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
export { useSymbAndLabelState, useLabelAndSymbDispatch }

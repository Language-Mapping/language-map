import React, { FC } from 'react'

import { LegendSwatch } from 'components/legend/types'
import { LayerPropsPlusMeta } from 'components/map/types'
import fullLangStyle from 'components/map/config.lang-style'
import { LangSchemaCol } from './types'

type LegendSymbols = { [key: string]: Partial<LayerPropsPlusMeta> }
export type Action =
  | { type: 'SET_LANG_LAYER_LABELS'; payload: LangSchemaCol | '' }
  | { type: 'SET_LANG_LAYER_LEGEND'; payload: LegendSwatch[] }
  | { type: 'SET_LANG_LAYER_SYMBOLOGY'; payload: LangSchemaCol }
type InitialState = {
  activeLabelID: LangSchemaCol | '' | 'None'
  activeSymbGroupID: LangSchemaCol | '' | 'None'
  legendItems: LegendSwatch[]
  legendSymbols: LegendSymbols
}
type Dispatch = React.Dispatch<Action>
type State = InitialState

// TODO: consider separate file
const legendSymbols = fullLangStyle.reduce((all, thisOne) => {
  const { paint, type, layout } = thisOne

  return { ...all, [thisOne.id as string]: { paint, type, layout } }
}, {})

export const initialState = {
  activeLabelID: '',
  activeSymbGroupID: 'World Region',
  legendItems: [],
  legendSymbols,
} as InitialState

const SymbAndLabelContext = React.createContext<State | undefined>(undefined)
const SymbLabelDispatchContext = React.createContext<Dispatch | undefined>(
  undefined
)

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'SET_LANG_LAYER_LABELS':
      return {
        ...state,
        activeLabelID: action.payload,
      }
    case 'SET_LANG_LAYER_LEGEND':
      return {
        ...state,
        legendItems: action.payload,
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

// USAGE: `const symbLabelState = useSymbAndLabelState()`
function useSymbAndLabelState(): InitialState {
  const context = React.useContext(SymbAndLabelContext)

  if (context === undefined) {
    throw new Error('useCountState must be used within a CountProvider')
  }

  // TODO: destructure the return
  return context
}

// USAGE: `const symbLabelDispatch = useLabelAndSymbDispatch()`
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

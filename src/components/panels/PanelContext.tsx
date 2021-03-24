// NOTE: some of this file was adapted from an existing GitHub project with an
// MIT License, available here:
// https://github.com/Covid-Self-report-Tool/cov-self-report-frontend/blob/master/LICENSE
import React, { useReducer, useContext, createContext, FC } from 'react'

// TODO: 3-state mobile panel
// export type PanelState = 'default' | 'maximized' | 'minimized'
// panelState: PanelState // TODO: 3-state mobile panel
type InitialState = { panelOpen: boolean; searchTabsOpen: boolean }
type PanelAction =
  | { type: 'TOGGLE_MAIN_PANEL'; payload?: boolean }
  | { type: 'TOGGLE_SEARCH_TABS'; payload?: boolean }
type Dispatch = React.Dispatch<PanelAction>

const initialState: InitialState = { panelOpen: true, searchTabsOpen: false }

const reducer = (state: InitialState, action: PanelAction): InitialState => {
  switch (action.type) {
    case 'TOGGLE_MAIN_PANEL':
      return {
        ...state,
        panelOpen:
          action.payload !== undefined ? action.payload : !state.panelOpen,
      }
    case 'TOGGLE_SEARCH_TABS':
      return {
        ...state,
        searchTabsOpen:
          action.payload !== undefined ? action.payload : !state.searchTabsOpen,
      }
    default:
      return state
  }
}

const PanelStateContext = createContext<InitialState | undefined>(undefined)
const PanelDispatchContext = createContext<Dispatch | undefined>(undefined)

export const PanelContextProvider: FC = (props) => {
  const { children } = props
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <PanelStateContext.Provider value={state}>
      <PanelDispatchContext.Provider value={dispatch}>
        {children}
      </PanelDispatchContext.Provider>
    </PanelStateContext.Provider>
  )
}

function usePanelState(): InitialState {
  const context = useContext(PanelStateContext)

  if (context === undefined) {
    throw new Error('usePanelState must be used within a CountProvider')
  }

  // TODO: destructure the return
  return context
}

function usePanelDispatch(): Dispatch {
  const context = useContext(PanelDispatchContext)

  if (context === undefined) {
    throw new Error('usePanelDispatch must be used within a CountProvider')
  }

  return context
}

export { usePanelState, usePanelDispatch }

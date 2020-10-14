import React, { FC, useContext, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { GlobalContext, LoadingBackdrop } from 'components'
import { FabPanelToggle } from 'components/panels/FabPanelToggle'
import {
  MOBILE_PANEL_HEADER_HEIGHT,
  panelWidths,
} from 'components/panels/config'
import { getIDfromURLparams } from '../../utils'

type MapPanelProps = { panelOpen?: boolean }
type MapWrapProps = { map: React.ReactNode; mapLoaded: boolean }

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appWrapRoot: {
      bottom: 0,
      display: 'flex',
      left: 0,
      overflow: 'hidden',
      position: 'absolute',
      right: 0,
      top: 0,
      [theme.breakpoints.down('sm')]: { flexDirection: 'column' },
      '& .mapboxgl-popup-tip': {
        borderTopColor: theme.palette.background.paper,
      },
      '& .mapboxgl-popup-content': {
        backgroundColor: theme.palette.background.paper,
      },
    },
    mapWrap: {
      flex: 1,
      position: 'absolute',
      right: 0,
      top: 0,
      transition: '300ms ease all',
      [theme.breakpoints.down('sm')]: {
        left: 0,
        bottom: (props: MapPanelProps) =>
          props.panelOpen ? '50%' : MOBILE_PANEL_HEADER_HEIGHT,
      },
      [theme.breakpoints.up('md')]: {
        bottom: 0,
        left: (props: MapPanelProps) => (props.panelOpen ? panelWidths.mid : 0),
      },
      [theme.breakpoints.up('xl')]: {
        left: (props: MapPanelProps) =>
          props.panelOpen ? panelWidths.midLarge : 0,
      },
    },
  })
)

export const MapWrap: FC<MapWrapProps> = (props) => {
  const { children, mapLoaded, map: Map } = props
  const { state, dispatch } = useContext(GlobalContext)
  const loc = useLocation()
  const { langFeatures } = state
  const classes = useStyles({ panelOpen: state.panelState === 'default' })

  // Do selected feature stuff on location change
  useEffect((): void => {
    const idFromUrl = getIDfromURLparams(loc.search)

    if (!langFeatures.length || !idFromUrl) {
      dispatch({ type: 'SET_SEL_FEAT_ATTRIBS', payload: null })

      return
    }

    // TODO: handle scenario where feature exists in cached but not filtered
    // const matchedFeat = state.langFeatures.find()

    const matchingRecord = langFeatures.find((row) => row.ID === idFromUrl)

    if (matchingRecord) {
      document.title = `${matchingRecord.Language as string} - NYC Languages`
      dispatch({ type: 'SET_SEL_FEAT_ATTRIBS', payload: matchingRecord })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loc.search, state.langFeatures.length])

  return (
    <>
      {!mapLoaded && <LoadingBackdrop />}
      <main className={classes.appWrapRoot}>
        <div className={classes.mapWrap}>{Map}</div>
        {children}
        <FabPanelToggle />
      </main>
    </>
  )
}

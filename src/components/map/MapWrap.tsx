import React, { FC, useState, useContext, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import {
  Box,
  BottomNavigation,
  BottomNavigationAction,
  IconButton,
} from '@material-ui/core'
import { MdClose } from 'react-icons/md'

import { Map, MapPanel } from 'components/map'
import { GlobalContext } from 'components'
import { LayerPropsNonBGlayer } from './types'
import { panelsConfig } from '../../config/panels-config'
import { getIDfromURLparams, getMbStyleDocument } from '../../utils'
import { mbStyleTileConfig } from './config'

const transforms = {
  open: 'translateY(0%)',
  closed: 'translateY(100%)',
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mapWrapRoot: {
      bottom: 0,
      position: 'absolute',
      top: 0,
      width: '100%',
      overflow: 'hidden',
      // TODO: ensure attribution and logo are both clearly visible at all
      // breakpoints. A bit mixed/scattered RN.
      '& .mb-language-map .mapboxgl-ctrl-bottom-left': {
        [theme.breakpoints.down('sm')]: {
          top: 60,
          bottom: 'auto',
        },
      },
    },
    mapItselfWrap: {
      bottom: 0,
      position: 'absolute',
      top: 0,
      width: '100%',
    },
    mapPanelsWrap: {
      left: theme.spacing(1),
      right: theme.spacing(1),
      position: 'absolute',
      bottom: 60,
      top: '50%',
      transition: '300ms transform',
      [theme.breakpoints.up('sm')]: {
        width: 425,
        top: 140,
        bottom: theme.spacing(5), // above mapbox logo
        left: 16,
      },
      '& .MuiPaper-root': {
        overflowY: 'auto',
        height: '100%',
      },
    },
    bottomNavRoot: {
      position: 'absolute',
      left: theme.spacing(1),
      right: theme.spacing(1),
      bottom: 0, // nice and flush = more room
      '& svg': {
        height: 20,
        width: 20,
      },
      [theme.breakpoints.up('sm')]: {
        width: 425,
        top: theme.spacing(8),
        left: theme.spacing(2),
        bottom: theme.spacing(1), // above MB logo?
      },
    },
    closePanel: {
      color: theme.palette.common.white,
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      zIndex: 2,
    },
  })
)

export const MapWrap: FC = () => {
  const classes = useStyles()
  const loc = useLocation()
  const { state, dispatch } = useContext(GlobalContext)
  const [panelOpen, setPanelOpen] = useState(true)
  const [symbLayers, setSymbLayers] = useState<LayerPropsNonBGlayer[]>()
  const [labelLayers, setLabelLayers] = useState<LayerPropsNonBGlayer[]>()
  const { langFeaturesCached } = state

  // Fetch MB Style doc
  useEffect(() => {
    getMbStyleDocument(
      mbStyleTileConfig.symbStyleUrl,
      dispatch,
      setSymbLayers,
      setLabelLayers
    ).catch((errMsg) => {
      // eslint-disable-next-line no-console
      console.error(
        // TODO: wire up sentry
        `Something went wrong trying to fetch MB style JSON: ${errMsg}`
      )
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Do selected feature stuff on location change
  useEffect((): void => {
    const idFromUrl = getIDfromURLparams(window.location.search)

    if (!langFeaturesCached.length) {
      return
    }

    if (!idFromUrl || idFromUrl === -1) {
      dispatch({
        type: 'SET_SEL_FEAT_ATTRIBS',
        payload: null,
      })

      return
    }

    // TODO: handle scenario where feature exists in cached but not filtered
    // const matchedFeat = state.langFeaturesCached.find(
    //   (feat) => parsed.id === feat.ID.toString()
    // )
    const matchingRecord = langFeaturesCached.find(
      (record) => record.ID === idFromUrl
    )

    if (!matchingRecord) {
      dispatch({
        type: 'SET_SEL_FEAT_ATTRIBS',
        payload: null,
      })

      return
    }

    document.title = `${matchingRecord.Language as string} - NYC Languages`

    dispatch({
      type: 'SET_SEL_FEAT_ATTRIBS',
      payload: matchingRecord,
    })

    dispatch({
      type: 'SET_ACTIVE_PANEL_INDEX',
      payload: 2,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loc, state.langFeaturesCached.length])

  return (
    <div className={classes.mapWrapRoot}>
      {symbLayers && labelLayers && (
        <Map
          wrapClassName={classes.mapItselfWrap}
          symbLayers={symbLayers}
          labelLayers={labelLayers}
          baselayer={state.baselayer}
        />
      )}
      {/* TODO: this and BottomNav into separate component/s (very non-map) */}
      <Box
        // Need the `id` in order to find unique element for `map.setPadding`
        id="map-panels-wrap"
        className={classes.mapPanelsWrap}
        style={{
          transform: panelOpen ? transforms.open : transforms.closed,
          opacity: panelOpen ? 1 : 0,
          maxHeight: panelOpen ? '100%' : 0,
        }}
      >
        {panelOpen && (
          <IconButton
            aria-label="close"
            title="Hide panel"
            size="small"
            className={classes.closePanel}
            onClick={() => setPanelOpen(false)}
          >
            <MdClose />
          </IconButton>
        )}
        {panelsConfig.map((config, i) => (
          <MapPanel
            key={config.heading}
            {...config}
            active={i === state.activePanelIndex}
          />
        ))}
      </Box>
      <BottomNavigation
        showLabels
        className={classes.bottomNavRoot}
        value={state.activePanelIndex}
        onChange={(event, newValue) => {
          dispatch({ type: 'SET_ACTIVE_PANEL_INDEX', payload: newValue })

          // Open the container if closed, close it if already active panel
          if (panelOpen && newValue === state.activePanelIndex) {
            setPanelOpen(false)
          } else {
            setPanelOpen(true)
          }
        }}
      >
        {panelsConfig.map((config, i) => (
          <BottomNavigationAction
            value={i}
            key={config.heading}
            label={config.heading}
            icon={config.icon}
          />
        ))}
      </BottomNavigation>
    </div>
  )
}

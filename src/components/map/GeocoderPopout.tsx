import React, { FC } from 'react'
import { Map } from 'mapbox-gl'
// TODO: use the web merc center method so that popups are not offset on mobile
// import { WebMercatorViewport } from 'react-map-gl'
import Geocoder from 'react-map-gl-geocoder'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import {
  Typography,
  FormControlLabel,
  Popover,
  Box,
  Switch,
} from '@material-ui/core'

import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css'

import { MapCtrlBtnsProps, GeocodeResult } from './types'
import { MAPBOX_TOKEN, NYC_LAT_LONG } from './config'
import { useWindowResize } from '../../utils'
import * as utils from './utils'
import * as MapTypes from './types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    popoverContent: { padding: '1em', width: 310 },
    popoverContentText: { marginBottom: '.75em', fontSize: '0.8em' },
    layersMenuPaper: { overflow: 'visible' },
    switchFormCtrlRoot: {
      marginLeft: 0,
      marginTop: '0.8em',
    },
    smallerText: {
      fontSize: '0.8rem',
    },
  })
)

const LocationSearchContent: FC = (props) => {
  const { children } = props
  const classes = useStyles()

  return (
    <Box className={classes.popoverContent}>
      <Typography variant="h5" component="h3">
        Search by location
      </Typography>
      <Typography className={classes.popoverContentText}>
        <small>
          Enter an address, municipality, neighborhood, postal code, landmark,
          or other point of interest within the New York City metro area.
        </small>
      </Typography>
      {children}
    </Box>
  )
}

type GeocoderProps = Pick<MapCtrlBtnsProps, 'mapRef'> & {
  anchorEl: null | HTMLElement
  boundariesLayersVisible: boolean
  setAnchorEl: React.Dispatch<null | HTMLElement>
  setBoundariesLayersVisible: React.Dispatch<boolean>
}

export const GeocoderPopout: FC<GeocoderProps> = (props) => {
  const {
    anchorEl,
    setAnchorEl,
    mapRef,
    boundariesLayersVisible,
    setBoundariesLayersVisible,
  } = props
  const classes = useStyles()
  const { smallerText, switchFormCtrlRoot } = classes
  const layersMenuOpen = Boolean(anchorEl)
  const geocoderContainerRef = React.useRef<HTMLDivElement>(null)
  const { width, height } = useWindowResize()

  const handleLayersMenuClose = () => setAnchorEl(null)

  // TODO: most def different file
  const handleGeocodeResult = (geocodeResult: GeocodeResult) => {
    handleLayersMenuClose()

    if (!mapRef.current) return

    const map: Map = mapRef.current.getMap()
    const { center, bbox, text } = geocodeResult.result

    if (bbox) {
      // TODO:
      // if (geocodeResult.result.place_type[0] === 'neighborhood') {
      //   special things...
      // }
      const settings = {
        height,
        width,
        bounds: [
          [bbox[0], bbox[1]],
          [bbox[2], bbox[3]],
        ] as MapTypes.BoundsArray,
        padding: 25,
      }

      utils.flyToBounds(map, settings, null)
    } else {
      const settings = {
        latitude: center[1],
        longitude: center[0],
        zoom: 15,
        disregardCurrZoom: true,
      }

      utils.flyToPoint(map, settings, null, text)
    }
  }

  return (
    <Popover
      id="layers-menu"
      anchorEl={anchorEl}
      onClose={handleLayersMenuClose}
      open={layersMenuOpen}
      PaperProps={{ className: classes.layersMenuPaper }}
      transformOrigin={{ vertical: 'center', horizontal: 'right' }}
    >
      <LocationSearchContent>
        <div ref={geocoderContainerRef} />
        <FormControlLabel
          classes={{ label: smallerText, root: switchFormCtrlRoot }}
          // Prevent off-canvas from closing (but we want that to happen for all
          // the other elements in the off-canvas).
          onClick={(event) => event.stopPropagation()}
          control={
            <Switch
              checked={boundariesLayersVisible}
              onChange={() =>
                setBoundariesLayersVisible(!boundariesLayersVisible)
              }
              name="show-welcome-switch"
              size="small"
            />
          }
          label="Show neighborhoods and counties"
        />
        <Geocoder
          containerRef={geocoderContainerRef}
          countries="us"
          mapboxApiAccessToken={MAPBOX_TOKEN}
          mapRef={mapRef}
          onResult={handleGeocodeResult}
          placeholder="Enter a location"
          proximity={NYC_LAT_LONG}
          types="address,poi,postcode,locality,place,neighborhood"
          bbox={[-77.5, 38.4, -70.7, 42.89]}
        />
      </LocationSearchContent>
    </Popover>
  )
}

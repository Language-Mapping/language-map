import React, { FC, useContext } from 'react'
import { Map } from 'mapbox-gl'
import { WebMercatorViewport } from 'react-map-gl'
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

import { GlobalContext } from 'components'
import { MapCtrlBtnsProps, GeocodeResult } from './types'
import { MAPBOX_TOKEN, NYC_LAT_LONG } from './config'
import { useWindowResize } from '../../utils'

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

type GeocoderProps = Omit<MapCtrlBtnsProps, 'onMapCtrlClick'> & {
  anchorEl: null | HTMLElement
  setAnchorEl: React.Dispatch<null | HTMLElement>
}

export const GeocoderPopout: FC<GeocoderProps> = (props) => {
  const { state, dispatch } = useContext(GlobalContext)
  const { anchorEl, setAnchorEl, mapRef, isDesktop } = props
  const classes = useStyles()
  const { smallerText, switchFormCtrlRoot } = classes
  const layersMenuOpen = Boolean(anchorEl)
  const geocoderContainerRef = React.useRef<HTMLDivElement>(null)
  const { width, height } = useWindowResize()

  const handleLayersMenuClose = () => setAnchorEl(null)

  // TODO: most def different file
  const handleGeocodeResult = (geocodeResult: GeocodeResult) => {
    handleLayersMenuClose()

    const { center, bbox } = geocodeResult.result

    if (!mapRef.current) return

    const map: Map = mapRef.current.getMap()

    const geocodeMarkerLatLon = { latitude: center[1], longitude: center[0] }

    const shared = {
      forceViewportUpdate: true,
      selFeatAttribs: state.selFeatAttribs,
    }

    if (bbox) {
      const { latitude, longitude, zoom } = new WebMercatorViewport({
        width,
        height,
      }).fitBounds(
        [
          [bbox[0], bbox[1]],
          [bbox[2], bbox[3]],
        ],
        { padding: isDesktop ? 50 : 30 }
      )

      map.flyTo(
        {
          essential: true,
          center: { lng: longitude, lat: latitude },
          zoom,
        },
        shared
      )
    } else {
      map.flyTo(
        {
          essential: true,
          center,
          zoom: 15,
        },
        {
          ...shared,
          geocodeMarkerLatLon,
        }
      )
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
          classes={{
            label: smallerText,
            root: switchFormCtrlRoot,
          }}
          // Prevent off-canvas from closing (but we want that to happen for all
          // the other elements in the off-canvas).
          onClick={(event) => event.stopPropagation()}
          control={
            <Switch
              checked={state.boundariesLayerVisible}
              onChange={() => dispatch({ type: 'TOGGLE_NEIGHB_LAYER' })}
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
        />
      </LocationSearchContent>
    </Popover>
  )
}

import React, { FC } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { Typography, Popover, Box } from '@material-ui/core'
import Geocoder from 'react-map-gl-geocoder'

import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css'

import { flyToCoords } from './utils'
import { MapCtrlBtnsProps, GeocodeResult } from './types'
import { MAPBOX_TOKEN, NYC_LAT_LONG } from './config'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    popoverContent: { padding: '1em', width: 300 },
    popoverContentText: { marginBottom: '.75em', fontSize: '0.8em' },
    layersMenuPaper: { overflow: 'visible' },
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
          or other point of interest. Note that this project's focus is on the
          New York City metro area and surrounding locations, so no communities
          will be found outside that extent.
        </small>
      </Typography>
      {children}
    </Box>
  )
}

type GeocoderProps = Pick<MapCtrlBtnsProps, 'mapRef' | 'mapOffset'> & {
  anchorEl: null | HTMLElement
  setAnchorEl: React.Dispatch<null | HTMLElement>
}

export const GeocoderPopout: FC<GeocoderProps> = (props) => {
  const { anchorEl, setAnchorEl, mapOffset, mapRef } = props
  const classes = useStyles()
  const layersMenuOpen = Boolean(anchorEl)
  const geocoderContainerRef = React.useRef<HTMLDivElement>(null)

  const handleLayersMenuClose = () => setAnchorEl(null)

  const handleGeocodeResult = (geocodeResult: GeocodeResult) => {
    handleLayersMenuClose()

    if (mapRef.current) {
      flyToCoords(
        mapRef.current.getMap(),
        {
          latitude: geocodeResult.result.center[1],
          longitude: geocodeResult.result.center[0],
          zoom: 15, // TODO: bounds
        },
        mapOffset,
        null
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
        <Geocoder
          containerRef={geocoderContainerRef}
          countries="us"
          mapboxApiAccessToken={MAPBOX_TOKEN}
          mapRef={mapRef}
          onResult={handleGeocodeResult}
          placeholder="Enter a location..."
          proximity={NYC_LAT_LONG}
          types="address,poi,postcode,locality,place,neighborhood"
        />
      </LocationSearchContent>
    </Popover>
  )
}

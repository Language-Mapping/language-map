import React, { FC } from 'react'
import { Map } from 'mapbox-gl'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { Typography, Popover, Box } from '@material-ui/core'
import Geocoder from 'react-map-gl-geocoder'

import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css'

import { flyToCoords, getWebMercSettings } from './utils'
import { MapCtrlBtnsProps, GeocodeResult } from './types'
import { MAPBOX_TOKEN, NYC_LAT_LONG } from './config'
import { useWindowResize } from '../../utils'

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

type GeocoderProps = Omit<MapCtrlBtnsProps, 'onMapCtrlClick'> & {
  anchorEl: null | HTMLElement
  setAnchorEl: React.Dispatch<null | HTMLElement>
}

export const GeocoderPopout: FC<GeocoderProps> = (props) => {
  const { anchorEl, setAnchorEl, mapOffset, mapRef, isDesktop } = props
  const classes = useStyles()
  const layersMenuOpen = Boolean(anchorEl)
  const geocoderContainerRef = React.useRef<HTMLDivElement>(null)
  const { width, height } = useWindowResize()

  const handleLayersMenuClose = () => setAnchorEl(null)

  const handleGeocodeResult = (geocodeResult: GeocodeResult) => {
    handleLayersMenuClose()

    if (!mapRef.current) return

    const { center, bbox } = geocodeResult.result

    if (bbox) {
      const { latitude, longitude, zoom } = getWebMercSettings(
        width,
        height,
        isDesktop,
        mapOffset,
        [
          [bbox[0], bbox[1]],
          [bbox[2], bbox[3]],
        ]
      )

      const map: Map = mapRef.current.getMap()

      map.flyTo(
        {
          // Not THAT essential if you... don't like cool things
          essential: true,
          center: { lng: longitude, lat: latitude },
          zoom,
        },
        { forceViewportUpdate: true }
      )
    } else {
      flyToCoords(
        mapRef.current.getMap(),
        { latitude: center[1], longitude: center[0], zoom: 15 },
        mapOffset
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

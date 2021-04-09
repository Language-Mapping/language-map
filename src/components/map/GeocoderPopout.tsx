// TODO: rename file to something logical
import React, { FC, useRef } from 'react'
import { Map } from 'mapbox-gl'
import Geocoder from 'react-map-gl-geocoder'
import { createStyles, makeStyles, Theme } from '@material-ui/core'

import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css'

import { useMapToolsDispatch } from 'components/context'
import { useUItext } from 'components/generic'
import { MAPBOX_TOKEN, NYC_LAT_LONG, POINT_ZOOM_LEVEL } from './config'
import { useWindowResize } from '../../utils'
import { flyToBounds, flyToPoint } from './utils'
import { GeocodeResult, BoundsArray, GeocoderPopoutProps } from './types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& .mapboxgl-ctrl-geocoder': {
        maxWidth: 'unset',
        width: '100%',
        fontSize: '1rem',
      },
      '& .mapboxgl-ctrl-geocoder--icon-search': {
        fill: theme.palette.grey[500],
        fontSize: '1rem',
        height: '1.5rem',
        left: 6,
        opacity: 0.65, // different "search" icon than Mui, looks too dark
        top: 8,
        width: '1.5rem',
      },
      '& .mapboxgl-ctrl-geocoder--input': {
        color: theme.palette.grey[700],
        fontSize: '1rem',
        height: 40, // roughly same as omnibox
        padding: '0.15rem 1rem 0.15rem 2.25rem', // huge horiz padding for icon
        // Make text more opaque than the 0.5 default
        // CRED: https://stackoverflow.com/a/48545561/1048518
        '&::placeholder': {
          opacity: 0.85,
        },
      },
      '& .mapboxgl-ctrl-geocoder .suggestions': {
        position: 'static', // otherwise absolute pos. hides it
      },
    },
  })
)

export const GeocoderPopout: FC<GeocoderPopoutProps> = (props) => {
  const { mapRef } = props
  const geocoderContainerRef = useRef<HTMLDivElement>(null)
  const { width, height } = useWindowResize()
  const { text: placeholderText } = useUItext('loc-search-placeholder')
  const classes = useStyles()
  const mapToolsDispatch = useMapToolsDispatch()
  const handleGeocodeResult = ({ result }: GeocodeResult) => {
    if (!mapRef.current) return

    const map: Map = mapRef.current.getMap()
    const { center, bbox, text } = result
    const inputElem = document.querySelector<HTMLInputElement>(
      '.mapboxgl-ctrl-geocoder--input'
    )

    if (inputElem) inputElem.blur()

    if (bbox) {
      // TODO: if (geocodeResult.result.place_type[0] === 'neighborhood')...
      const settings = {
        height,
        width,
        bounds: [
          [bbox[0], bbox[1]],
          [bbox[2], bbox[3]],
        ] as BoundsArray,
        padding: 25,
      }

      flyToBounds(map, settings)
    } else {
      const settings = {
        latitude: center[1],
        longitude: center[0],
        zoom: POINT_ZOOM_LEVEL,
        disregardCurrZoom: true,
      }

      flyToPoint(map, settings)
      mapToolsDispatch({
        type: 'SET_GEOCODE_LABEL',
        payload: {
          latitude: center[1],
          longitude: center[0],
          text,
        },
      })
    }
  }

  return (
    <div className={classes.root}>
      <div ref={geocoderContainerRef} />
      <Geocoder
        bbox={[-77.5, 38.4, -70.7, 42.89]}
        clearAndBlurOnEsc
        collapsed
        containerRef={geocoderContainerRef}
        countries="us"
        // inputValue="Astoria" // good for debugging since it stays open
        limit={3} // default: 5
        mapboxApiAccessToken={MAPBOX_TOKEN}
        mapRef={mapRef}
        marker={false}
        onClear={() => {
          mapToolsDispatch({ type: 'SET_GEOCODE_LABEL', payload: null })
        }}
        onResult={handleGeocodeResult} // TODO: useCallback
        placeholder={placeholderText || ' '}
        proximity={NYC_LAT_LONG}
        types="address,poi,postcode,locality,place,neighborhood"
      />
    </div>
  )
}

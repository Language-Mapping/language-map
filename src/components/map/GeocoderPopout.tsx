import React, { FC, useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import { Theme } from '@mui/material'

import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'

import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'

import { useMapToolsDispatch } from 'components/context'
import { useBreakpoint, useUItext } from 'components/generic'
import { MAPBOX_TOKEN, NYC_LAT_LONG, POINT_ZOOM_LEVEL } from './config'
import { flyToBounds, flyToPoint } from './utils'
import { BoundsArray, GeocoderPopoutProps } from './types'

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
        opacity: 0.65,
        top: 8,
        width: '1.5rem',
      },
      '& .mapboxgl-ctrl-geocoder--input': {
        color: theme.palette.grey[700],
        fontSize: '1rem',
        height: 40,
        padding: '0.15rem 1rem 0.15rem 2.25rem',
        '&::placeholder': {
          fontSize: '0.85rem',
          opacity: 0.85,
        },
      },
      '& .mapboxgl-ctrl-geocoder .suggestions': {
        position: 'static',
      },
    },
  })
)

type GeocodeResult = {
  result: {
    center: [number, number]
    text: string
    bbox?: [number, number, number, number]
  }
}

export const GeocoderPopout: FC<GeocoderPopoutProps> = (props) => {
  const { mapRef } = props
  const containerRef = useRef<HTMLDivElement>(null)
  const breakpoint = useBreakpoint()
  const { text: placeholderText } = useUItext('loc-search-placeholder')
  const classes = useStyles()
  const mapToolsDispatch = useMapToolsDispatch()

  useEffect(() => {
    const container = containerRef.current

    if (!container) return undefined

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const geocoder = new (MapboxGeocoder as any)({
      accessToken: MAPBOX_TOKEN,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mapboxgl: mapboxgl as any,
      bbox: [-77.5, 38.4, -70.7, 42.89],
      clearAndBlurOnEsc: true,
      collapsed: true,
      countries: 'us',
      limit: 3,
      marker: false,
      placeholder: placeholderText || ' ',
      proximity: NYC_LAT_LONG,
      types: 'address,poi,postcode,locality,place,neighborhood',
    })

    const handleResult = ({ result }: GeocodeResult) => {
      const map = mapRef.current?.getMap()

      if (!map) return

      const { center, bbox, text } = result
      const inputElem = document.querySelector<HTMLInputElement>(
        '.mapboxgl-ctrl-geocoder--input'
      )

      if (inputElem) inputElem.blur()

      if (bbox) {
        flyToBounds(map, {
          height: map.getContainer().offsetHeight,
          width: map.getContainer().offsetWidth,
          bounds: [
            [bbox[0], bbox[1]],
            [bbox[2], bbox[3]],
          ] as BoundsArray,
          breakpoint,
        })
      } else {
        flyToPoint(map, {
          latitude: center[1],
          longitude: center[0],
          zoom: POINT_ZOOM_LEVEL,
          disregardCurrZoom: true,
        })
        mapToolsDispatch({
          type: 'SET_GEOCODE_LABEL',
          payload: { latitude: center[1], longitude: center[0], text },
        })
      }
    }

    const handleClear = () => {
      mapToolsDispatch({ type: 'SET_GEOCODE_LABEL', payload: null })
    }

    geocoder.on('result', handleResult)
    geocoder.on('clear', handleClear)
    geocoder.addTo(container)

    return () => {
      geocoder.off('result', handleResult)
      geocoder.off('clear', handleClear)
      container.replaceChildren()
    }
    // Re-create the geocoder when the placeholder text resolves so it's not
    // stuck on the loading-state placeholder.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placeholderText])

  return (
    <div className={classes.root}>
      <div ref={containerRef} />
    </div>
  )
}

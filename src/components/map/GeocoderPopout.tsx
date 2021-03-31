// TODO: rename file to something logical; mv it and all children to ../local
import React, { FC } from 'react'
import { Map } from 'mapbox-gl'
import Geocoder from 'react-map-gl-geocoder'
import { FormControlLabel, Switch } from '@material-ui/core'

import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css'

import { useMapToolsState, useMapToolsDispatch } from 'components/context'
import { SimplePopover, useUItext } from 'components/generic'
import { usePanelState } from 'components/panels'
import { MAPBOX_TOKEN, NYC_LAT_LONG } from './config'
import { useWindowResize } from '../../utils'
import { useLocalPanelStyles } from './styles'
import { useOffset } from './hooks'
import { flyToBounds, flyToPoint } from './utils'
import { GeocodeResult, BoundsArray, GeocoderPopoutProps } from './types'

export const GeocoderPopout: FC<GeocoderPopoutProps> = (props) => {
  const { mapRef } = props
  const classes = useLocalPanelStyles()
  const { panelOpen } = usePanelState()
  const { smallerText, switchFormCtrlRoot } = classes
  const geocoderContainerRef = React.useRef<HTMLDivElement>(null)
  const { width, height } = useWindowResize()
  const offset = useOffset(panelOpen)
  const { showNeighbs } = useMapToolsState()
  const mapToolsDispatch = useMapToolsDispatch()
  const { text: placeholderText } = useUItext('loc-search-placeholder')

  // TODO: most def different file
  const handleGeocodeResult = ({ result }: GeocodeResult) => {
    if (!mapRef.current) return

    const map: Map = mapRef.current.getMap()
    const { center, bbox, text } = result

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
        offset,
      }

      flyToBounds(map, settings)
    } else {
      const settings = {
        latitude: center[1],
        longitude: center[0],
        zoom: 15,
        disregardCurrZoom: true,
        offset,
      }

      flyToPoint(map, settings, text)
    }
  }

  const handleNeighborhoodsToggle = () => {
    mapToolsDispatch({
      type: 'TOGGLE_NEIGHBORHOODS_LAYER',
    })
  }

  const ControlLabel = (
    <div className={classes.controlLabel}>
      Show neighborhoods
      <SimplePopover
        text={
          <>
            Neighborhoods are shown within NYC's five boroughs, and counties
            (coming soon) for the surrounding areas.{' '}
            <em>Source: NYC Census 2020 map</em>
          </>
        }
      />
    </div>
  )

  return (
    <>
      <div ref={geocoderContainerRef} />
      <FormControlLabel
        // Prevent off-canvas from closing (but we want that to happen for all
        // the other elements in the off-canvas).
        onClick={(event) => event.stopPropagation()}
        classes={{ label: smallerText, root: switchFormCtrlRoot }}
        control={
          <Switch
            checked={showNeighbs}
            onChange={handleNeighborhoodsToggle}
            name="show-welcome-switch"
            size="small"
          />
        }
        label={ControlLabel}
      />
      <Geocoder
        containerRef={geocoderContainerRef}
        countries="us"
        mapboxApiAccessToken={MAPBOX_TOKEN}
        mapRef={mapRef}
        onResult={handleGeocodeResult}
        placeholder={placeholderText}
        proximity={NYC_LAT_LONG}
        types="address,poi,postcode,locality,place,neighborhood"
        bbox={[-77.5, 38.4, -70.7, 42.89]}
      />
    </>
  )
}

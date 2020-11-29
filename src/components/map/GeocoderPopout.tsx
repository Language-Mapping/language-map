// TODO: rename file to something logical; mv it and all children to ../spatial
import React, { FC } from 'react'
import { Map } from 'mapbox-gl'
import Geocoder from 'react-map-gl-geocoder'
import { FormControlLabel, Switch } from '@material-ui/core'

import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css'

import { useMapToolsState, useMapToolsDispatch } from 'components/context'
import { SimplePopover } from 'components/generic'
import { MAPBOX_TOKEN, NYC_LAT_LONG } from './config'
import { useWindowResize } from '../../utils'
import * as hooks from './hooks'
import * as utils from './utils'
import * as Types from './types'
import { LocationSearchContent } from './LocationSearchContent'
import { useSpatialPanelStyles } from './styles'

export const GeocoderPopout: FC<Types.SpatialPanelProps> = (props) => {
  const { mapRef, panelOpen } = props
  const classes = useSpatialPanelStyles()
  const { smallerText, switchFormCtrlRoot } = classes
  const geocoderContainerRef = React.useRef<HTMLDivElement>(null)
  const { width, height } = useWindowResize()
  const offset = hooks.useOffset(panelOpen)
  const { boundariesVisible } = useMapToolsState()
  const mapToolsDispatch = useMapToolsDispatch()

  // TODO: most def different file
  const handleGeocodeResult = ({ result }: Types.GeocodeResult) => {
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
        ] as Types.BoundsArray,
        padding: 25,
        offset,
      }

      utils.flyToBounds(map, settings, null)
    } else {
      const settings = {
        latitude: center[1],
        longitude: center[0],
        zoom: 15,
        disregardCurrZoom: true,
        offset,
      }

      utils.flyToPoint(map, settings, null, text)
    }
  }

  const handleBoundariesToggle = () => {
    mapToolsDispatch({
      type: 'SET_BOUNDARIES_VISIBLE',
      payload: !boundariesVisible,
    })
  }

  const ControlLabel = (
    <div className={classes.controlLabel}>
      Show neighborhoods and counties
      <SimplePopover
        text={
          <>
            Neighborhoods are shown within NYC's five boroughs, and counties for
            the surrounding areas. <em>Source: Mapbox Boundaries</em>
          </>
        }
      />
    </div>
  )

  return (
    <LocationSearchContent>
      <div ref={geocoderContainerRef} />
      <FormControlLabel
        // Prevent off-canvas from closing (but we want that to happen for all
        // the other elements in the off-canvas).
        onClick={(event) => event.stopPropagation()}
        classes={{ label: smallerText, root: switchFormCtrlRoot }}
        control={
          <Switch
            checked={boundariesVisible}
            onChange={handleBoundariesToggle}
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
        placeholder="e.g. Staten Island, Central Park, Statue of Liberty"
        proximity={NYC_LAT_LONG}
        types="address,poi,postcode,locality,place,neighborhood"
        bbox={[-77.5, 38.4, -70.7, 42.89]}
      />
    </LocationSearchContent>
  )
}

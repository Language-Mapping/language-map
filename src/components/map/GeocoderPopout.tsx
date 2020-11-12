// TODO: rename file to something logical; mv it and all children to ../spatial
import React, { FC } from 'react'
import { Map } from 'mapbox-gl'
import Geocoder from 'react-map-gl-geocoder'
import { FormControlLabel, Switch } from '@material-ui/core'

import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css'

import { MAPBOX_TOKEN, NYC_LAT_LONG } from './config'
import { useWindowResize } from '../../utils'
import * as hooks from './hooks'
import * as utils from './utils'
import * as Types from './types'
import { CensusToggle } from './CensusToggle'
import { GeolocToggle } from './GeolocToggle'
import { LocationSearchContent } from './LocationSearchContent'
import { useSpatialPanelStyles } from './styles'

export const GeocoderPopout: FC<Types.SpatialPanelProps> = (props) => {
  const {
    boundariesVisible,
    censusVisible,
    geolocActive,
    mapRef,
    panelOpen,
    setBoundariesVisible,
    setCensusVisible,
    setGeolocActive,
  } = props
  const classes = useSpatialPanelStyles()
  const { smallerText, switchFormCtrlRoot } = classes
  const geocoderContainerRef = React.useRef<HTMLDivElement>(null)
  const { width, height } = useWindowResize()
  const offset = hooks.useOffset(panelOpen)

  // TODO: most def different file
  const handleGeocodeResult = (geocodeResult: Types.GeocodeResult) => {
    if (!mapRef.current) return

    const map: Map = mapRef.current.getMap()
    const { center, bbox, text } = geocodeResult.result

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

  const SearchByLocation = (
    <LocationSearchContent
      heading="Search by location"
      explanation="Enter an address, municipality, neighborhood, postal code, landmark,
      or other point of interest within the New York City metro area."
    >
      <div ref={geocoderContainerRef} />
      <FormControlLabel
        // Prevent off-canvas from closing (but we want that to happen for all
        // the other elements in the off-canvas).
        onClick={(event) => event.stopPropagation()}
        classes={{ label: smallerText, root: switchFormCtrlRoot }}
        control={
          <Switch
            checked={boundariesVisible}
            onChange={() => setBoundariesVisible(!boundariesVisible)}
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
  )

  return (
    <>
      <CensusToggle
        setCensusVisible={setCensusVisible}
        censusVisible={censusVisible}
      />
      {SearchByLocation}
      <GeolocToggle
        geolocActive={geolocActive}
        setGeolocActive={setGeolocActive}
      />
    </>
  )
}

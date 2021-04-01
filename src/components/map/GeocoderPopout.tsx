// TODO: rename file to something logical; mv it and all children to ../local
import React, { FC } from 'react'
import { Map } from 'mapbox-gl'
import Geocoder from 'react-map-gl-geocoder'

import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css'

import { useUItext } from 'components/generic'
import { usePanelState } from 'components/panels'
import { MAPBOX_TOKEN, NYC_LAT_LONG } from './config'
import { useWindowResize } from '../../utils'
import { useOffset } from './hooks'
import { flyToBounds, flyToPoint } from './utils'
import { GeocodeResult, BoundsArray, GeocoderPopoutProps } from './types'

export const GeocoderPopout: FC<GeocoderPopoutProps> = (props) => {
  const { mapRef } = props
  const { panelOpen } = usePanelState()
  const geocoderContainerRef = React.useRef<HTMLDivElement>(null)
  const { width, height } = useWindowResize()
  const offset = useOffset(panelOpen)
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

  return (
    <>
      <div ref={geocoderContainerRef} />
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

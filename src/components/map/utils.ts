import * as mbGlFull from 'mapbox-gl'

import { StoreActionType } from '../../context/types'
import { MapEventType, LangFeatureType, LayerPropsPlusMeta } from './types'
import { createMapLegend } from '../../utils'

// One of the problems of using panels which overlap the map is how to deal with
// "centering", in quotes because it's more "perceived" centering. Offset is
// needed to make a panned-to selected feature centered between the header and
// panel (on mobile) or between the panel and the right side (on desktop).
export const prepMapOffset = (
  isDesktop: boolean,
  topBarElemID = 'page-header',
  mapPanelsElemeID = 'map-panels-wrap'
): [number, number] => {
  const topBarElem = document.getElementById(topBarElemID)
  const topBarHeight = topBarElem ? topBarElem.offsetHeight : 60

  if (!isDesktop) {
    // NOTE: very important to use `innerHeight` here! Otherwise the buttons,
    // address bar, etc. are not taken into account.
    const halfScreenHeight = window.innerHeight / 2
    const visibleViewportHt = halfScreenHeight - topBarHeight
    const vertOffset = -1 * (visibleViewportHt / 2)

    return [0, vertOffset]
  }

  const sidePanelElem = document.getElementById(mapPanelsElemeID)
  const sidePanelWidth = sidePanelElem ? sidePanelElem.scrollWidth : 60
  const sidePanelGutter = sidePanelElem ? sidePanelElem.offsetLeft : 16

  return [(sidePanelWidth + sidePanelGutter) / 2, topBarHeight / 2]
}

export function flyToCoords(
  target: mbGlFull.Map,
  settings: { lng: number; lat: number; zoom?: number | 10.25 },
  offset: [number, number]
): void {
  const { zoom, lat, lng } = settings

  target.flyTo(
    {
      // Animation considered essential with respect to prefers-reduced-motion
      essential: true,
      center: {
        lng,
        lat,
      },
      zoom,
      offset,
      duration: 700,
    },
    {
      openPopup: true,
      newPosition: {
        center: { lat, lng },
        zoom,
      },
    }
  )
}

// Only if features exist and the top one matches the language source ID
export const areLangFeatsUnderCursor = (
  features: LangFeatureType[],
  internalSrcID: string
): boolean =>
  features && features.length !== 0 && features[0].source === internalSrcID

export function handleHover(
  event: MapEventType,
  sourceID: string,
  setShowPopup: React.Dispatch<{ show: boolean; lat?: number; lon?: number }>
): void {
  const { features, target } = event

  if (!areLangFeatsUnderCursor(features, sourceID)) {
    // TODO: hide label on mouseout
    target.style.cursor = 'default'
    setShowPopup({
      show: false,
    })
  } else {
    // TODO: show label on hover
    target.style.cursor = 'pointer'
    setShowPopup({
      show: true,
      lat: features[0].properties.Latitude,
      lon: features[0].properties.Longitude,
    })
  }
}

export const initLegend = (
  dispatch: React.Dispatch<StoreActionType>,
  activeLangSymbGroupId: string,
  symbLayers: LayerPropsPlusMeta[]
): void => {
  const layersInActiveGroup = symbLayers.filter(
    (layer: LayerPropsPlusMeta) =>
      layer.metadata['mapbox:group'] === activeLangSymbGroupId
  )

  const legend = createMapLegend(layersInActiveGroup)

  dispatch({
    type: 'SET_LANG_LAYER_LEGEND',
    payload: legend,
  })
}

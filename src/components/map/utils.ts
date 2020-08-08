import * as mbGlFull from 'mapbox-gl'
import { PaddingOptions } from 'mapbox-gl'

import { StoreActionType } from '../../context/types'
import { MapEventType, LangFeatureType, LayerPropsPlusMeta } from './types'
import { createMapLegend } from '../../utils'

// One of the problems of using panels which overlap the map is how to deal with
// "centering", in quotes because it's more "perceived" centering. Offset is
// needed to make a panned-to selected feature centered between the header and
// panel (on mobile) or between the panel and the right side (on desktop).
export const prepMapPadding = (
  isDesktop: boolean,
  topBarElemID = 'page-header',
  mapPanelsElemeID = 'map-panels-wrap'
): PaddingOptions => {
  const topBarElem = document.getElementById(topBarElemID)
  const topBarHeight = topBarElem ? topBarElem.offsetHeight : 60
  const defaults = {
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  }

  if (!isDesktop) {
    return {
      ...defaults,
      bottom: window.screen.height / 4 + topBarHeight * 2,
    }
  }

  const sidePanelElem = document.getElementById(mapPanelsElemeID)
  const sidePanelWidth = sidePanelElem ? sidePanelElem.scrollWidth : 60
  const sidePanelGutter = sidePanelElem ? sidePanelElem.offsetLeft : 16

  return {
    ...defaults,
    left: sidePanelWidth + sidePanelGutter,
    top: topBarHeight,
  }
}

export function flyToCoords(
  target: mbGlFull.Map,
  settings: { lng: number; lat: number; zoom?: number | 10.25 }
): void {
  const { zoom, lat, lng } = settings

  target.flyTo(
    {
      // Animation is considered essential with respect to
      // prefers-reduced-motion
      essential: true,
      center: { lat, lng },
      zoom,
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

export function handleHover(event: MapEventType, sourceID: string): void {
  const { features, target } = event

  if (!areLangFeatsUnderCursor(features, sourceID)) {
    // TODO: hide label on mouseout
    target.style.cursor = 'default'
  } else {
    // TODO: show label on hover
    target.style.cursor = 'pointer'
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

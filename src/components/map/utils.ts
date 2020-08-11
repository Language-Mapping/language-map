import * as mbGlFull from 'mapbox-gl'

import { StoreActionType, LangRecordSchema } from '../../context/types'
import {
  MapTooltipType,
  MapEventType,
  LangFeatureType,
  LayerPropsNonBGlayer,
} from './types'
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
  map: mbGlFull.Map,
  settings: { lng: number; lat: number; zoom?: number | 10.25 },
  offset: [number, number],
  selFeatAttribs: LangRecordSchema | null
): void {
  const { zoom, lat, lng } = settings
  const currentZoom = map.getZoom()

  map.flyTo(
    {
      // Animation considered essential with respect to prefers-reduced-motion
      essential: true,
      center: {
        lng,
        lat,
      },
      offset,
      // Only zoom to the default if current zoom is less than that
      zoom: zoom && currentZoom < zoom ? zoom : currentZoom,
    },
    // Custom event data
    {
      forceViewportUpdate: true, // to keep state in sync
      selFeatAttribs, // popup data
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
  setTooltipOpen: React.Dispatch<MapTooltipType | null>
): void {
  const { features, target } = event

  if (!areLangFeatsUnderCursor(features, sourceID)) {
    // TODO: hide label on mouseout
    target.style.cursor = 'default'
    setTooltipOpen(null)
  } else {
    const { Latitude, Longitude, Endonym, Language } = features[0].properties

    // TODO: show label on hover
    target.style.cursor = 'pointer'
    setTooltipOpen({
      latitude: Latitude,
      longitude: Longitude,
      heading: Endonym, // TODO: image if Dropbox/http
      subHeading: Endonym === Language ? '' : Language,
    })
  }
}

export const initLegend = (
  dispatch: React.Dispatch<StoreActionType>,
  activeLangSymbGroupId: string,
  symbLayers: LayerPropsNonBGlayer[]
): void => {
  const layersInActiveGroup = symbLayers.filter(
    (layer) => layer.metadata['mapbox:group'] === activeLangSymbGroupId
  )

  const legend = createMapLegend(layersInActiveGroup)

  dispatch({
    type: 'SET_LANG_LAYER_LEGEND',
    payload: legend,
  })
}

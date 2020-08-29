import { Map } from 'mapbox-gl'

import { PAGE_HEADER_ID } from 'components/nav/config'
import * as MapTypes from './types'
import { isURL } from '../../utils'

// One of the problems of using panels which overlap the map is how to deal with
// "centering", in quotes because it's more "perceived" centering. Offset is
// needed to make a panned-to selected feature centered between the header and
// panel (on mobile) or between the panel and the right side (on desktop).
export const prepMapOffset = (
  isDesktop: boolean,
  topBarElemID = PAGE_HEADER_ID,
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

export const flyToCoords: MapTypes.FlyToCoords = (
  map,
  settings,
  offset,
  selFeatAttribs
) => {
  const {
    zoom: targetZoom,
    latitude: lat,
    longitude: lng,
    disregardCurrZoom,
  } = settings
  const currentZoom = map.getZoom()
  const customEventData = {
    forceViewportUpdate: true, // to keep state in sync
    selFeatAttribs, // popup data
    disregardCurrZoom,
  }
  let zoomToUse = targetZoom

  // Only zoom to the default if current zoom is higher than that
  if (!disregardCurrZoom && targetZoom && currentZoom > targetZoom) {
    zoomToUse = currentZoom
  }

  map.flyTo(
    {
      // Animation considered essential with respect to prefers-reduced-motion
      essential: true,
      center: { lng, lat },
      offset,
      zoom: zoomToUse,
    },
    customEventData
  )
}

// Only if features exist and the top one matches the language source ID
export const areLangFeatsUnderCursor = (
  features: MapTypes.LangFeature[],
  internalSrcID: string
): boolean =>
  features && features.length !== 0 && features[0].source === internalSrcID

export function handleHover(
  event: MapTypes.MapEvent,
  sourceID: string,
  setTooltipOpen: React.Dispatch<MapTypes.MapTooltip | null>
): void {
  const { features, target } = event

  if (!areLangFeatsUnderCursor(features, sourceID)) {
    target.style.cursor = 'default'
    setTooltipOpen(null)
  } else {
    const { Latitude, Longitude, Endonym, Language } = features[0].properties
    const isImage = isURL(Endonym)
    target.style.cursor = 'pointer'

    setTooltipOpen({
      latitude: Latitude,
      longitude: Longitude,
      heading: isImage ? Language : Endonym,
      subHeading: isImage || Endonym === Language ? '' : Language,
    })
  }
}

// TODO: recycle the icons if it makes sense
export const addLangTypeIconsToMap = (
  map: Map,
  iconsConfig: MapTypes.LangIconConfig[]
): void => {
  iconsConfig.forEach((config) => {
    const { id, icon } = config

    if (map.hasImage(id)) {
      map.removeImage(id)
    }

    // CRED:
    // https://github.com/mapbox/mapbox-gl-js/issues/5529#issuecomment-340011876
    const img = new Image(48, 48) // src files are 24x24 viewbox
    img.onload = () => map.addImage(id, img)
    img.src = icon
  })
}

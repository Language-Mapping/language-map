import { Map } from 'mapbox-gl'
import { WebMercatorViewport } from 'react-map-gl'

import { PAGE_HEADER_ID } from 'components/nav/config'
import * as MapTypes from './types'
import { LangRecordSchema } from '../../context/types'
import { prettyTruncateList } from '../../utils'

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
      essential: true, // not THAT essential if you... don't like cool things
      center: { lng, lat },
      offset,
      zoom: zoomToUse,
    },
    customEventData
  )
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

export const filterLayersByFeatIDs = (
  map: Map,
  layerNames: string[],
  langFeatIDs: null | number[]
): void => {
  layerNames.forEach((name) => {
    const currentFilters = map.getFilter(name)

    // Clear it first // TODO: rm if not necessary
    map.setFilter(name, null)

    let origFilter = []

    // TODO: consider usefulness, otherwise remove:
    // const layer =  map.getLayer(name)
    // GROSS dude. Gotta be a better way to check?
    if (currentFilters[0] === 'all') {
      ;[, origFilter] = currentFilters
    } else {
      origFilter = currentFilters
    }

    if (langFeatIDs === null) {
      map.setFilter(name, origFilter)
    } else {
      map.setFilter(name, [
        'all',
        origFilter,
        // CRED: https://gis.stackexchange.com/a/287629/5824
        ['in', ['get', 'ID'], ['literal', langFeatIDs]],
      ])
    }
  })
}

export const getWebMercSettings = (
  width: number,
  height: number,
  isDesktop: boolean,
  mapOffset: [number, number],
  bounds: MapTypes.BoundsArray,
  padding?: { top: number; bottom: number; left: number; right: number }
): { latitude: number; longitude: number; zoom: number } => {
  return new WebMercatorViewport({
    width,
    height,
  }).fitBounds(bounds, {
    padding: padding || {
      bottom: isDesktop ? mapOffset[1] : height / 2,
      left: isDesktop ? mapOffset[0] : 0,
      right: 0,
      top: 0,
    },
  })
}

export const fetchBoundariesLookup = async (path: string): Promise<void> =>
  (await fetch(path)).json()

export const prepSelLangFeatPopup = (
  selFeatAttribs: LangRecordSchema
): { heading: string; subheading: string } => {
  const {
    Endonym,
    Language,
    Neighborhoods,
    'Font Image Alt': altImage,
  } = selFeatAttribs

  // For image-only endos, show language (not much room for pic)
  const heading = altImage ? Language : Endonym
  const subheading = Neighborhoods ? prettyTruncateList(Neighborhoods) : ''

  return { heading, subheading }
}

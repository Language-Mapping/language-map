import { Map } from 'mapbox-gl'
import { WebMercatorViewport } from 'react-map-gl'

import { PAGE_HEADER_ID } from 'components/nav/config'
import * as MapTypes from './types'
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
  iconsConfig.forEach((iconConfig) => {
    const { id, icon } = iconConfig

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

export const getWebMercViewport: MapTypes.GetWebMercSettings = (params) => {
  const { width, height, isDesktop, mapOffset, bounds, padding } = params

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

type Gar = {
  lngLat: [number, number]
  pos: [number, number]
  width: number
  height: number
  zoom: number
}

export const getWebMercMapCenter = (params: Gar): [number, number] => {
  // const { width, height, isDesktop, mapOffset, bounds, padding } = params
  const { lngLat, pos, width, height, zoom } = params

  return new WebMercatorViewport({
    width,
    height,
    latitude: lngLat[1],
    longitude: lngLat[0],
    zoom,
  }).getMapCenterByLngLatPosition({ lngLat, pos })
}

export const fetchBoundariesLookup = async (path: string): Promise<void> =>
  (await fetch(path)).json()

export const prepPopupContent: MapTypes.PrepPopupContent = (
  selFeatAttribs,
  popupHeading
) => {
  if (popupHeading) return { heading: popupHeading }
  if (!selFeatAttribs) return null

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

export const justFly: MapTypes.JustFly = (map, settings, popupContent) => {
  const { zoom, longitude, latitude, offset, around } = settings

  // // Only zoom to the default if current zoom is higher than that
  // if (!disregardCurrZoom && targetZoom && currentZoom > targetZoom) {
  //   zoomToUse = currentZoom
  // }

  const yo = offset ? { offset } : { center: { lng: longitude, lat: latitude } }
  /* eslint-disable operator-linebreak */
  const popupSettings = popupContent
    ? { latitude, longitude, ...popupContent }
    : null
  /* eslint-enable operator-linebreak */

  map.flyTo(
    {
      essential: true,
      zoom,
      around: around || [longitude, latitude],
      ...yo,
    },
    { forceViewportUpdate: true, popupSettings } as MapTypes.CustomEventData
  )
}

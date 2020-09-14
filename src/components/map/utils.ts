import { Map } from 'mapbox-gl'
import { WebMercatorViewport } from 'react-map-gl'

import * as MapTypes from './types'
import * as config from './config'

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
  langFeatIDs: number[]
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

    if (!langFeatIDs.length) {
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

export const getWebMercViewport: MapTypes.GetWebMercViewport = (params) => {
  const { width, height, bounds, padding } = params

  return new WebMercatorViewport({
    width,
    height,
  }).fitBounds(bounds, padding ? { padding } : {})
}

export const fetchBoundariesLookup = async (path: string): Promise<void> =>
  (await fetch(path)).json()

export const prepPopupContent: MapTypes.PrepPopupContent = (
  selFeatAttribs,
  popupHeading
) => {
  if (popupHeading) return { heading: popupHeading }
  if (!selFeatAttribs) return null

  const { Endonym, Language, 'Font Image Alt': altImage } = selFeatAttribs

  return {
    heading: altImage ? Language : Endonym,
    subheading: altImage || Endonym === Language ? '' : Language,
  }
}

export const flyToBounds: MapTypes.FlyToBounds = (
  map,
  { height, width, bounds },
  popupContent
) => {
  let popupSettings = null

  const webMercViewport = new WebMercatorViewport({
    width,
    height,
  }).fitBounds(bounds, { padding: 50 })
  const { latitude, longitude, zoom } = webMercViewport

  if (popupContent) popupSettings = { latitude, longitude, ...popupContent }

  map.flyTo({ essential: true, zoom, center: [longitude, latitude] }, {
    forceViewportUpdate: true,
    popupSettings,
  } as MapTypes.CustomEventData)
}

export const flyToPoint: MapTypes.FlyToPoint = (
  map,
  { latitude, longitude, zoom: targetZoom, disregardCurrZoom },
  popupContent,
  geocodeMarkerText
) => {
  let zoom = targetZoom
  let popupSettings = null

  const currentZoom = map.getZoom()

  // Only zoom to the default if current zoom is higher than that
  if (disregardCurrZoom && currentZoom > targetZoom) zoom = currentZoom
  if (popupContent) popupSettings = { latitude, longitude, ...popupContent }

  const customEventData = {
    forceViewportUpdate: true,
    popupSettings,
  } as MapTypes.CustomEventData

  if (geocodeMarkerText) {
    customEventData.geocodeMarker = {
      longitude,
      latitude,
      text: geocodeMarkerText,
    }
  }

  map.flyTo(
    { essential: true, zoom, center: [longitude, latitude] },
    customEventData
  )
}

export const langFeatsUnderClick: MapTypes.LangFeatsUnderClick = (
  point,
  map,
  interactiveLayerIds
) => {
  return map.queryRenderedFeatures(
    [
      [point[0] - 5, point[1] - 5],
      [point[0] + 5, point[1] + 5],
    ],
    {
      layers: interactiveLayerIds.lang,
    }
  )
}

export const clearBoundaries: MapTypes.ClearStuff = (map) => {
  map.removeFeatureState({
    source: config.neighSrcId,
    sourceLayer: config.neighPolyID,
  })
  // }, 'hover') // NOTE: could not get this to work properly anywhere

  map.removeFeatureState({
    source: config.countiesSrcId,
    sourceLayer: config.countiesPolyID,
  })
}

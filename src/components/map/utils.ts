import { Map } from 'mapbox-gl'
import { WebMercatorViewport } from 'react-map-gl'

import * as MapTypes from './types'
import * as config from './config'
import { prettyTruncateList } from '../../utils'

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
  const {
    zoom: targetZoom,
    longitude,
    latitude,
    offset,
    around,
    disregardCurrZoom,
  } = settings
  const currentZoom = map.getZoom()
  let zoom = targetZoom

  // Only zoom to the default if current zoom is higher than that
  if (disregardCurrZoom && currentZoom > targetZoom) zoom = currentZoom

  /* eslint-disable operator-linebreak */
  const popupSettings = popupContent
    ? { latitude, longitude, ...popupContent }
    : null
  /* eslint-enable operator-linebreak */
  const final = {
    essential: true,
    zoom,
    around: around || [longitude, latitude],
    offset: offset || [0, 0],
    // center: { lng: longitude, lat: latitude },
  }

  map.flyTo(final, {
    forceViewportUpdate: true,
    popupSettings,
  } as MapTypes.CustomEventData)
}

export const flyToBounds: MapTypes.JustFly = (map, settings, popupContent) => {
  const {
    zoom: targetZoom,
    longitude,
    latitude,
    offset,
    around,
    disregardCurrZoom,
  } = settings
  const currentZoom = map.getZoom()
  let zoom = targetZoom

  // Only zoom to the default if current zoom is higher than that
  if (disregardCurrZoom && currentZoom > targetZoom) zoom = currentZoom

  /* eslint-disable operator-linebreak */
  const popupSettings = popupContent
    ? { latitude, longitude, ...popupContent }
    : null
  /* eslint-enable operator-linebreak */
  const final = {
    essential: true,
    zoom,
    around: around || [longitude, latitude],
    offset: offset || [0, 0],
    // center: { lng: longitude, lat: latitude },
  }

  map.flyTo(final, {
    forceViewportUpdate: true,
    popupSettings,
  } as MapTypes.CustomEventData)
}

export const langFeatsUnderClick: MapTypes.LangFeatsUnderClick = (
  point,
  map,
  interactiveLayerIds
) => {
  return map.queryRenderedFeatures(
    [
      [point[0], point[1]],
      [point[0], point[1]],
    ],
    {
      layers: interactiveLayerIds.lang,
    }
  )
}

export const clearStuff: MapTypes.ClearStuff = (map, setTooltipOpen) => {
  if (setTooltipOpen) setTooltipOpen(null)

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

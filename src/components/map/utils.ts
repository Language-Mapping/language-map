import { Map, FillPaint } from 'mapbox-gl'
import { WebMercatorViewport } from 'react-map-gl'

import { LangConfig } from 'components/context'
import * as Types from './types'
import * as config from './config' // TODO: pass this as fn args, don't import

// NOTE: Firefox needs SVG width/height to be explicitly set on the SVG in order
// for this to work.
// CRED:
// https://github.com/mapbox/mapbox-gl-js/issues/5529#issuecomment-465403194
export const addLangTypeIconsToMap = (
  map: Map,
  iconsConfig: Types.LangIconConfig[]
): void => {
  if (!map) return // maybe fixes this:
  // sentry.io/organizations/endangered-language-alliance/issues/2073089812

  iconsConfig.forEach((iconConfig) => {
    const { id, icon } = iconConfig

    if (map.hasImage(id)) {
      map.removeImage(id)
    }

    // CRED:
    // https://github.com/mapbox/mapbox-gl-js/issues/5529#issuecomment-340011876
    const img = new Image(48, 48) // src files are 24x24 viewbox

    // Enabling the `sdf` property allows icons to be colored on the fly:
    // https://docs.mapbox.com/help/troubleshooting/using-recolorable-images-in-mapbox-maps/#mapbox-gl-js
    img.onload = () => map?.addImage(id, img, { sdf: true })
    // TODO: confirm fixed (same as Sentry comment above):
    // `TypeError: null is not an object (evaluating 'e.addImage')
    // sentry.io/organizations/endangered-language-alliance/issues/2073089812
    img.src = icon
  })
}

// Includes
export const filterLayersByFeatIDs = (
  map: Map,
  layerNames: string[],
  langFeatIDs: number[]
): void => {
  if (!layerNames.length) return // FIXME: you know what

  layerNames.forEach((name) => {
    // CRED: https://gis.stackexchange.com/a/287629/5824
    const filterLangsByID = ['in', ['get', 'ID'], ['literal', langFeatIDs]]
    const currentFilters = map.getFilter(name)

    let origFilter = []
    let filterToUse = filterLangsByID

    // TODO: consider usefulness, otherwise remove: `map.getLayer(name)`
    map.setFilter(name, null) // clear it first // TODO: rm if not necessary

    // GROSS dude. Gotta be a better way to check?
    if (currentFilters && currentFilters[0] === 'all') {
      ;[, origFilter] = currentFilters
    } else if (currentFilters) {
      // Irrelevant for labels layers since no init filters at time of writing:
      origFilter = currentFilters
    }

    // TODO: tighten this up!
    if (!['Language', 'Endonym'].includes(name)) {
      filterToUse = ['all', origFilter, filterLangsByID]
    }

    map.setFilter(name, filterToUse)
  })
}

export const asyncAwaitFetch = async <T extends unknown>(
  path: string
): Promise<T> => (await fetch(path)).json()

export const prepPopupContent: Types.PrepPopupContent = (
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

export const flyToBounds: Types.FlyToBounds = (
  map,
  { height, width, bounds, offset },
  popupContent
) => {
  let popupSettings = null

  const webMercViewport = new WebMercatorViewport({
    width,
    height,
  }).fitBounds(bounds, { offset, padding: 75 })
  const { latitude, longitude, zoom } = webMercViewport

  if (popupContent) popupSettings = { latitude, longitude, ...popupContent }

  map.flyTo({ essential: true, zoom, center: [longitude, latitude], offset }, {
    forceViewportUpdate: true,
    popupSettings,
  } as Types.CustomEventData)
}

export const flyToPoint: Types.FlyToPoint = (
  map,
  settings,
  popupContent,
  geocodeMarkerText
) => {
  const {
    bearing = 0,
    disregardCurrZoom,
    latitude,
    longitude,
    offset,
    pitch = 0,
    zoom: targetZoom,
  } = settings
  let zoom = targetZoom
  let popupSettings = null

  const currentZoom = map.getZoom()

  // Only zoom to the default if current zoom is higher than that
  if (disregardCurrZoom && currentZoom > targetZoom) zoom = currentZoom
  if (popupContent) popupSettings = { latitude, longitude, ...popupContent }

  const customEventData = {
    forceViewportUpdate: true,
    popupSettings,
  } as Types.CustomEventData

  if (geocodeMarkerText) {
    customEventData.geocodeMarker = {
      longitude,
      latitude,
      text: geocodeMarkerText,
    }
  }
  const params = {
    essential: true,
    zoom,
    center: [longitude, latitude] as [number, number],
    bearing,
    pitch,
    offset,
  }

  if (disregardCurrZoom) {
    map.flyTo(params, customEventData)
  } else {
    map.easeTo(params, customEventData)
  }
}

export const langFeatsUnderClick: Types.LangFeatsUnderClick = (
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

export const clearBoundaries: Types.ClearStuff = (map) => {
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

// Convert a Google Sheets API response into Mapbox font filters. For it to have
// any impact, the fonts must be uploaded to the Mapbox account and their names
// must be identical to those in the sheet.
/* eslint-disable @typescript-eslint/no-explicit-any */
export const prepEndoFilters = (data: LangConfig[]): any[] => {
  const filters = data
    .filter((row) => row.Font)
    .reduce((all, thisOne) => {
      const lang = ['==', ['var', 'lang'], thisOne.Language]
      const font = ['literal', [thisOne.Font]]

      return [...all, lang, font]
    }, [] as any[])

  return [
    'let',
    'lang',
    ['get', 'Language'],
    [
      'case',
      ...filters,
      ['literal', ['Noto Sans Regular', 'Arial Unicode MS Regular']],
    ],
  ]
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// Exponential looks pretty good, at least for the tract-level so far
// https://docs.mapbox.com/mapbox-gl-js/style-spec/expressions/#interpolate
export const setInterpolatedFill = (
  highest: number,
  lowest?: number
): FillPaint => ({
  'fill-color': [
    'case',
    ['!=', ['feature-state', 'total'], NaN],
    [
      'interpolate',
      ['exponential', ...[0.95]],
      ['feature-state', 'total'], // TODO: TS for "total"
      lowest || 0,
      'rgb(237, 248, 233)',
      highest,
      'rgb(0, 109, 44)',
    ],
    'rgba(255, 255, 255, 0)',
  ],
  'fill-opacity': 0.9,
})

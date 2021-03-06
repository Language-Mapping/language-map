import * as Sentry from '@sentry/react'
import { Map as MbMap, FillPaint, Layer, setRTLTextPlugin } from 'mapbox-gl'
import { WebMercatorViewport } from 'react-map-gl'

import * as Types from './types'
import * as config from './config' // TODO: pass this as fn args, don't import

// NOTE: Firefox needs SVG width/height to be explicitly set on the SVG in order
// for this to work.
// CRED:
// https://github.com/mapbox/mapbox-gl-js/issues/5529#issuecomment-465403194
export const addLangTypeIconsToMap = (
  map: MbMap,
  iconsConfig: Types.LangIconConfig[]
): void => {
  if (!map) return // maybe fixes this:
  // sentry.io/organizations/endangered-language-alliance/issues/2073089812

  iconsConfig.forEach((iconConfig) => {
    const { id, icon } = iconConfig

    if (map.hasImage(id)) map.removeImage(id)

    // CRED: github.com/mapbox/mapbox-gl-js/issues/5529#issuecomment-340011876
    const img = new Image(48, 48) // src files are 24x24 viewbox

    // Enabling the `sdf` property allows icons to be colored on the fly:
    // https://docs.mapbox.com/help/troubleshooting/using-recolorable-images-in-mapbox-maps/#mapbox-gl-js
    img.onload = () =>
      map.hasImage(id) ? null : map.addImage(id, img, { sdf: true })

    // TODO: confirm fixed (same as Sentry comment above):
    // `TypeError: null is not an object (evaluating 'e.addImage')
    // sentry.io/organizations/endangered-language-alliance/issues/2073089812
    img.src = icon
  })
}

// Includes
export const filterLayersByFeatIDs = (
  map: MbMap,
  layerNames: string[],
  langFeatIDs: string[]
): void => {
  if (!layerNames.length || !langFeatIDs.length) return // FIXME: (???)

  layerNames.forEach((name) => {
    // CRED: https://gis.stackexchange.com/a/287629/5824
    const filterLangsByID = [
      'in',
      ['get', 'id'],
      ['literal', langFeatIDs.map((id) => id.toString())],
    ]
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
  { height, width, bounds, breakpoint }
) => {
  const { offsetHeight, offsetWidth } = map.getContainer()
  let padding: number

  if (breakpoint === 'mobile' || breakpoint === 'tablet') padding = 25
  else padding = 100

  // Prevent all kinds of crashes
  if (padding * 2 > offsetHeight || padding * 2 > offsetWidth) padding = 0

  try {
    const webMercViewport = new WebMercatorViewport({
      width,
      height,
    }).fitBounds(bounds, { padding })
    const { latitude, longitude, zoom } = webMercViewport

    map.flyTo({ essential: true, zoom, center: [longitude, latitude] }, {
      forceViewportUpdate: true,
    } as Types.CustomEventData)
  } catch (e) {
    Sentry.withScope(() => {
      Sentry.captureException(
        new Error('Web merc viewport bad news in flyToBounds ')
      )
    })
  }
}

export const flyToPoint: Types.FlyToPoint = (
  map,
  settings,
  geocodeMarkerText
) => {
  const {
    bearing = 0,
    disregardCurrZoom,
    latitude,
    longitude,
    zoom: targetZoom,
  } = settings
  let zoom = targetZoom

  const currentZoom = map.getZoom()

  // Only zoom to the default if current zoom is higher than that
  if (disregardCurrZoom && currentZoom > targetZoom) zoom = currentZoom

  const customEventData = {
    forceViewportUpdate: true,
  } as Types.CustomEventData

  if (geocodeMarkerText) {
    customEventData.geocodeMarker = {
      longitude,
      latitude,
      text: geocodeMarkerText,
    }
  }

  const center = [longitude, latitude] as [number, number]
  const params = { essential: true, zoom, center, bearing }

  if (disregardCurrZoom) {
    map.flyTo(params, customEventData)
  } else {
    map.easeTo(params, customEventData)
  }
}

export const queryRenderedPoints: Types.LangFeatsUnderClick = (
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
      layers: interactiveLayerIds,
    }
  )
}

// Set up Mapbox font filters for languages with complex endonym characters. In
// order for it to have any impact, the fonts must be uploaded to the Mapbox
// account and their names must be identical to those in the sheet.
/* eslint-disable @typescript-eslint/no-explicit-any */
export const prepEndoFilters = (
  data: { Font: string; name: string }[]
): any[] => {
  const filters = data
    .filter((row) => row.Font)
    .reduce((all, thisOne) => {
      const lang = ['==', ['var', 'lang'], thisOne.name]
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
export const setInterpolatedFill = (high: number, low = 0): FillPaint => ({
  'fill-color': [
    'case',
    ['!=', ['feature-state', 'total'], NaN],
    [
      'interpolate',
      ['exponential', ...[0.95]],
      ['feature-state', 'total'], // TODO: TS for "total"
      low,
      'rgb(237, 248, 233)',
      high,
      'rgb(0, 109, 44)',
    ],
    'rgba(255, 255, 255, 0)',
  ],
  'fill-opacity': 0.9,
})

export const flyHome: Types.FlyHome = (map, breakpoint): void => {
  const settings = {
    height: map.getContainer().offsetHeight,
    width: map.getContainer().offsetWidth,
    bounds: config.initialBounds,
    breakpoint,
  }

  // TODO: prevent errors on resize-while-loading
  flyToBounds(map, settings)
}

export const getFlyToPointSettings = (
  coords: { lat: number; lon: number },
  isMapTilted: boolean
): Types.FlyToPointSettings => ({
  // bearing: 80, // TODO: consider it as it does add a new element of fancy
  longitude: coords.lon,
  latitude: coords.lat,
  zoom: config.POINT_ZOOM_LEVEL,
  disregardCurrZoom: true,
  pitch: isMapTilted ? 80 : 0,
})

// REFACTOR: just reduce it one go instead of mapping, filtering, mapping again
export const getLangLayersIDs = (layers: Layer[]): string[] => {
  const mapped = Object.keys(layers).map((layer) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore // TODO
    const { source, id } = layers[layer]

    return { source, id }
  })

  if (!mapped.length) return []

  return mapped
    .filter((layer) => layer.source === config.mbStyleTileConfig.langSrcID)
    .map((layer) => layer.id)
}

export const rightToLeftSetup = (): void => {
  // Jest or whatever CANNOT find this plugin. And importing it from
  // `react-map-gl` is useless as well.
  if (typeof window !== undefined && typeof setRTLTextPlugin === 'function') {
    // Ensure right-to-left languages (Arabic, Hebrew) are shown correctly
    setRTLTextPlugin(
      // latest version: https://www.npmjs.com/package/@mapbox/mapbox-gl-rtl-text
      'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      (error): Error => error, // supposed to be an error-handling function
      true // lazy: only load when the map first encounters Hebrew or Arabic text
    )
  }
}

// Get the center of a rectangle, e.g. a polygon w/o dedicated centroid columns
export const getCenterOfBounds = (
  cornerCoords: Types.BoundsColumns
): Types.LongLat => {
  const { x_max: xMax, x_min: xMin, y_min: yMin, y_max: yMax } = cornerCoords

  const latitude = (yMax - yMin) / 2 + yMin
  const longitude = (xMin - xMax) / 2 + xMax

  return { latitude, longitude }
}

// CRED: geeksforgeeks.org/how-to-detect-touch-screen-device-using-javascript/
export const isTouchEnabled = (): boolean =>
  (window && 'ontouchstart' in window) ||
  navigator.maxTouchPoints > 0 ||
  navigator.msMaxTouchPoints > 0

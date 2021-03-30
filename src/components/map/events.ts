import { InstanceLevelSchema } from 'components/context'

import { MapboxGeoJSONFeature } from 'mapbox-gl'
import { WebMercatorViewport } from 'react-map-gl'
import * as utils from './utils'
import * as MapTypes from './types'

export const onHover = (event: MapTypes.MapEvent): void => {
  const { target } = event
  target.style.cursor = 'pointer'
}

export const onHoverOrig: MapTypes.OnHover = (
  event,
  setTooltip,
  map,
  interactiveLayerIds
) => {
  const { point, target } = event
  const { boundaries } = interactiveLayerIds

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore // not showing up even though it's typed... 🤔
  if (event.pointerType === 'touch') return // "hover" is weird on touchscreens

  // Close tooltip and clear stuff no matter what
  setTooltip(null)

  if (boundaries.length) utils.clearSelPolyFeats(map)

  const langsHovered = utils.langFeatsUnderClick(
    event.point,
    map,
    interactiveLayerIds
  )

  let boundariesHovered: MapboxGeoJSONFeature[] = []

  if (boundaries.length)
    boundariesHovered = map.queryRenderedFeatures(point, { layers: boundaries })

  if (langsHovered.length || boundariesHovered.length) {
    target.style.cursor = 'pointer'
  } else {
    target.style.cursor = 'default'
  }

  if (langsHovered.length) {
    const headingAndSubheading = utils.prepPopupContent(
      langsHovered[0].properties as InstanceLevelSchema
    )

    if (!headingAndSubheading) return // should also be something tho...

    /* eslint-disable @typescript-eslint/ban-ts-comment */
    setTooltip({
      // @ts-ignore // TODO: defeat
      latitude: langsHovered[0].geometry.coordinates[1],
      // @ts-ignore // TODO: defeat
      longitude: langsHovered[0].geometry.coordinates[0],
      ...headingAndSubheading,
    })
    /* eslint-enable @typescript-eslint/ban-ts-comment */
  }

  if (boundariesHovered.length) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore // TODO: defeat
    const sourceLayer = boundariesHovered[0].layer['source-layer']

    map.setFeatureState(
      {
        sourceLayer,
        source: boundariesHovered[0].source,
        id: boundariesHovered[0].id,
      },
      { hover: true }
    )
  }
}

export const flyToClickedPolygon: MapTypes.HandleBoundaryClick = (
  map,
  topMostFeat,
  boundsConfig,
  offset
) => {
  utils.clearSelPolyFeats(map)

  // NOTE: rather than storing bounds in the lookup tables, tried
  // `boundaryFeat.geometry` instead. Sort of worked but since vector tiles only
  // render what's needed, there's no guarantee the whole feature's bbox will be
  // available in the current view. And there doesn't seem to be a way to get
  // its full bounds other than the lookup tables. 😞
  const {
    x_max: xMax,
    x_min: xMin,
    y_min: yMin,
    y_max: yMax,
  } = topMostFeat.properties
  const { width, height } = boundsConfig
  const boundsArray = [
    [xMin, yMin],
    [xMax, yMax],
  ] as MapTypes.BoundsArray

  const settings = {
    height,
    width,
    bounds: boundsArray,
    padding: 50,
    offset: offset || [0, 0],
  }

  const webMercViewport = new WebMercatorViewport({
    width,
    height,
  }).fitBounds(boundsArray, { offset, padding: 75 })

  utils.flyToBounds(map, settings)

  return { ...webMercViewport }
}

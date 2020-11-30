import { LangRecordSchema } from 'components/context/types'
import * as utils from './utils'
import * as MapTypes from './types'

export const onHover: MapTypes.OnHover = (
  event,
  setTooltip,
  map,
  interactiveLayerIds
) => {
  const { point, target } = event

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore // not showing up even though it's typed... 🤔
  if (event.pointerType === 'touch') return // "hover" is weird on touchscreens

  // Close tooltip and clear stuff no matter what
  setTooltip(null)

  if (interactiveLayerIds.boundaries.length) utils.clearBoundaries(map)

  const langsHovered = utils.langFeatsUnderClick(
    event.point,
    map,
    interactiveLayerIds
  )

  /* eslint-disable operator-linebreak */
  const boundariesHovered = interactiveLayerIds.boundaries.length
    ? map.queryRenderedFeatures(point, {
        layers: interactiveLayerIds.boundaries,
      })
    : []
  /* eslint-enable operator-linebreak */

  if (langsHovered.length || boundariesHovered.length) {
    target.style.cursor = 'pointer'
  } else {
    target.style.cursor = 'default'
  }

  if (langsHovered.length) {
    const headingAndSubheading = utils.prepPopupContent(
      langsHovered[0].properties as LangRecordSchema
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

export const handleBoundaryClick: MapTypes.HandleBoundaryClick = (
  map,
  topMostFeat,
  boundsConfig,
  lookup,
  offset
) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore // TODO: defeat
  const sourceLayer = topMostFeat.layer['source-layer']

  utils.clearBoundaries(map)

  map.setFeatureState(
    {
      sourceLayer,
      source: topMostFeat.source,
      id: topMostFeat.id,
    },
    { selected: true }
  )

  const matchingRecord = lookup.find((record) => topMostFeat.id === record.id)

  if (!matchingRecord) return // ya never knowww

  // NOTE: rather than storing bounds in the lookup tables, tried
  // `boundaryFeat.geometry` instead. Sort of worked but since vector tiles only
  // render what's needed, there's no guarantee the whole feature's bbox will be
  // available in the current view. And there doesn't seem to be a way to get
  // its full bounds other than the lookup tables. 😞
  const { bounds, name } = matchingRecord
  const { width, height } = boundsConfig

  const settings = {
    height,
    width,
    bounds: [
      [bounds[0], bounds[1]],
      [bounds[2], bounds[3]],
    ] as MapTypes.BoundsArray,
    padding: 50,
    offset: offset || [0, 0],
  }

  utils.flyToBounds(map, settings, { heading: name || '' })
}

import * as utils from './utils'
import * as MapTypes from './types'
import { LangRecordSchema } from '../../context/types'

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
    const { Endonym, Language, 'Font Image Alt': altImage } = langsHovered[0]
      .properties as LangRecordSchema

    /* eslint-disable @typescript-eslint/ban-ts-comment */
    setTooltip({
      // @ts-ignore // TODO: defeat
      latitude: langsHovered[0].geometry.coordinates[1],
      // @ts-ignore // TODO: defeat
      longitude: langsHovered[0].geometry.coordinates[0],
      heading: altImage ? Language : Endonym,
      subHeading: altImage || Endonym === Language ? '' : Language,
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
  lookup
) => {
  const boundaryFeat = topMostFeat
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore // TODO: defeat
  const sourceLayer = topMostFeat.layer['source-layer']

  utils.clearBoundaries(map)

  map.setFeatureState(
    {
      sourceLayer,
      source: topMostFeat.source,
      id: boundaryFeat.id,
    },
    { selected: true }
  )

  if (!lookup) return

  const matchingRecord = lookup.find(
    (record) => topMostFeat.id === record.feature_id
  )

  if (!matchingRecord) return // ya never knowww

  const { bounds, name, names } = matchingRecord
  const { width, height } = boundsConfig
  const text = name || (names ? names.en[0] : '')

  const settings = {
    height,
    width,
    bounds: [
      [bounds[0], bounds[1]],
      [bounds[2], bounds[3]],
    ] as MapTypes.BoundsArray,
    padding: 50,
  }

  utils.flyToBounds(map, settings, { heading: text })
}

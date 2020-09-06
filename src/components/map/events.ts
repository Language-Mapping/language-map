import { WebMercatorViewport } from 'react-map-gl'

import * as utils from './utils'
import * as MapTypes from './types'
import { LangRecordSchema } from '../../context/types'

export const onHover: MapTypes.OnHover = (
  event,
  setTooltipOpen,
  map,
  interactiveLayerIds
) => {
  const { point, target } = event

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore // not showing up even though it's typed... 🤔
  if (event.pointerType === 'touch') return // "hover" is weird on touchscreens

  // Close tooltip and clear stuff no matter what
  setTooltipOpen(null)

  if (interactiveLayerIds.boundaries.length) utils.clearStuff(map)

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
    const {
      Latitude,
      Longitude,
      Endonym,
      Language,
      'Font Image Alt': altImage,
    } = langsHovered[0].properties as LangRecordSchema

    setTooltipOpen({
      latitude: Latitude,
      longitude: Longitude,
      heading: altImage ? Language : Endonym,
      subHeading: altImage || Endonym === Language ? '' : Language,
    })
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

  utils.clearStuff(map)

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

  const { bounds, name, names, centroid } = matchingRecord
  const text = name || (names ? names.en[0] : '')
  const { width, height, isDesktop } = boundsConfig

  const popupSettings: MapTypes.PopupSettings = {
    heading: text,
    latitude: centroid[1],
    longitude: centroid[0],
  }

  const { latitude, longitude, zoom } = new WebMercatorViewport({
    width,
    height,
  }).fitBounds(
    [
      [bounds[0], bounds[1]],
      [bounds[2], bounds[3]],
    ],
    { padding: isDesktop ? 50 : 30 }
  )

  map.flyTo(
    {
      essential: true,
      zoom,
      center: { lon: longitude, lat: latitude },
    },
    { forceViewportUpdate: true, popupSettings }
  )
}

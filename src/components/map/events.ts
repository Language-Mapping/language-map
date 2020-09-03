import { Map } from 'mapbox-gl'

import * as config from './config'
import * as MapTypes from './types'
import { LangRecordSchema } from '../../context/types'

const { langSrcID } = config.mbStyleTileConfig
const { neighbConfig, countiesConfig } = config
const neighSrcId = neighbConfig.source.id
const countiesSrcId = countiesConfig.source.id

export function onHover(
  event: MapTypes.MapEvent,
  setTooltipOpen: React.Dispatch<MapTypes.MapTooltip | null>,
  map: Map
): void {
  const { features, target } = event
  const topMostFeature = features[0]
  const oneOfOurs = [langSrcID, neighSrcId, countiesSrcId].includes(
    topMostFeature.source
  )

  // Close tooltip no matter what
  setTooltipOpen(null)

  if (!topMostFeature || !oneOfOurs) {
    target.style.cursor = 'default'

    return
  }

  target.style.cursor = 'pointer'

  // Not Language points. Clear feature state then set to `hover`.
  if (topMostFeature.source !== langSrcID) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore // TODO: defeat
    const sourceLayer = topMostFeature.layer['source-layer']

    map.removeFeatureState({
      source: neighSrcId,
      sourceLayer: neighbConfig.layers[0]['source-layer'],
    })

    map.removeFeatureState({
      source: countiesSrcId,
      sourceLayer: countiesConfig.layers[0]['source-layer'],
    })

    map.setFeatureState(
      {
        sourceLayer,
        source: topMostFeature.source,
        id: topMostFeature.id,
      },
      { hover: true }
    )
  } else {
    const {
      Latitude,
      Longitude,
      Endonym,
      Language,
      'Font Image Alt': altImage,
    } = features[0].properties as LangRecordSchema

    setTooltipOpen({
      latitude: Latitude,
      longitude: Longitude,
      heading: altImage ? Language : Endonym,
      subHeading: altImage || Endonym === Language ? '' : Language,
    })
  }
}

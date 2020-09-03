import { Map } from 'mapbox-gl'

import * as config from './config'
import * as MapTypes from './types'
import { LangRecordSchema } from '../../context/types'

const { neighbConfig } = config
const neighSrcId = neighbConfig.source.id
const neighPolyID = neighbConfig.layers[0]['source-layer']
const { langSrcID } = config.mbStyleTileConfig

export function onHover(
  event: MapTypes.MapEvent,
  setTooltipOpen: React.Dispatch<MapTypes.MapTooltip | null>,
  map: Map
): void {
  const { features, target } = event
  const topMostFeature = features[0]

  // Close tooltip no matter what
  setTooltipOpen(null)

  if (
    !topMostFeature ||
    ![langSrcID, neighSrcId].includes(topMostFeature.source)
  ) {
    target.style.cursor = 'default'

    return
  }

  target.style.cursor = 'pointer'

  // Not Language points. Clear feature state then set to `hover`.
  if (topMostFeature.source !== langSrcID) {
    map.removeFeatureState({ source: neighSrcId, sourceLayer: neighPolyID })
    map.setFeatureState(
      {
        sourceLayer: neighPolyID,
        source: neighSrcId,
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

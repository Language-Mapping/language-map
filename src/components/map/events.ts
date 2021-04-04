import * as Types from './types'
import { mbStyleTileConfig } from './config'

export const onHover: Types.OnHover = (
  event,
  setTooltip,
  map,
  srcAndFeatID
) => {
  if (!map) return

  const { target, features } = event
  const topFeat = features[0]
  const topFeatSrc = topFeat?.source

  // Census hover wrecks the world
  const isOneOfOurs = [
    mbStyleTileConfig.langSrcID,
    'neighborhoods',
    'counties',
  ].includes(topFeatSrc)

  if (!isOneOfOurs) {
    target.style.cursor = 'default'
    setTooltip(null) // close it no matter what

    return
  }

  target.style.cursor = 'pointer'

  if (topFeatSrc !== mbStyleTileConfig.langSrcID) {
    setTooltip(null)

    const { sourceLayer, source, id } = topFeat

    map.removeFeatureState({ source, sourceLayer }) // clear each time
    map.setFeatureState({ sourceLayer, source, id }, { hover: true })

    if (srcAndFeatID && srcAndFeatID.srcID === source) {
      map.setFeatureState(
        { sourceLayer, source, id: srcAndFeatID.featID },
        { selected: true }
      )
    }

    return
  }

  const { properties, geometry } = topFeat

  // TODO: fix this crazy TSness
  /* eslint-disable @typescript-eslint/ban-ts-comment */
  setTooltip({
    // @ts-ignore
    latitude: geometry.coordinates[1],
    // @ts-ignore
    longitude: geometry.coordinates[0],
    // @ts-ignore
    text: properties.Language,
  })
  /* eslint-enable @typescript-eslint/ban-ts-comment */
}

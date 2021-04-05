import * as Types from './types'
import { mbStyleTileConfig } from './config'

const { langSrcID } = mbStyleTileConfig

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
  const highlightableLayers = [langSrcID, 'neighborhoods', 'counties'].includes(
    topFeatSrc
  )

  const cursorableLayers = [langSrcID, 'puma', 'tract'].includes(topFeatSrc)

  if (!highlightableLayers && !cursorableLayers) {
    target.style.cursor = 'default'
    setTooltip(null) // close it no matter what

    return
  }

  target.style.cursor = 'pointer' // give users indication that they can click

  if (!highlightableLayers) return // ...but jump ship for census (for now)

  if (topFeatSrc !== langSrcID) {
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

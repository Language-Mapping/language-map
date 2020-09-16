import { LayerPropsNonBGlayer } from 'components/map/types'
import { LegendSwatch } from './types'
import { StoreAction } from '../../context/types'

const createMapLegend = (layers: LayerPropsNonBGlayer[]): LegendSwatch[] => {
  return layers.map((layer) => {
    const { type, id, paint, layout } = layer
    const settings = { legendLabel: id, type } as LegendSwatch

    // Quite a fight against the MB types here...
    /* eslint-disable @typescript-eslint/ban-ts-comment */
    if (type === 'circle') {
      // @ts-ignore
      const backgroundColor = paint['circle-color']
      // @ts-ignore
      const size = paint['circle-radius'] || 5

      return {
        ...settings,
        size,
        backgroundColor,
      }
    }

    if (type === 'symbol') {
      return {
        ...settings,
        // @ts-ignore
        iconID: layout['icon-image'],
      }
    }
    /* eslint-enable @typescript-eslint/ban-ts-comment */

    return settings
  })
}

export const initLegend = (
  dispatch: React.Dispatch<StoreAction>,
  activeLangSymbGroupId: string,
  symbLayers: LayerPropsNonBGlayer[]
): void => {
  const layersInActiveGroup = symbLayers.filter(
    ({ group }) => group === activeLangSymbGroupId
  )

  const legend = createMapLegend(layersInActiveGroup)

  dispatch({
    type: 'SET_LANG_LAYER_LEGEND',
    payload: legend,
  })
}

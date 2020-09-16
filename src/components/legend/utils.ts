import { LayerPropsNonBGlayer } from 'components/map/types'
import { LegendSwatch } from './types'
import { StoreAction } from '../../context/types'

const createMapLegend = (layers: LayerPropsNonBGlayer[]): LegendSwatch[] => {
  return layers.map((layer) => {
    const { type, id, layout } = layer
    const settings = { legendLabel: id, type } as LegendSwatch

    return {
      ...settings,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      iconID: layout['icon-image'],
    }
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

  dispatch({ type: 'SET_LANG_LAYER_LEGEND', payload: legend })
}

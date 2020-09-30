import { LayerPropsPlusMeta } from 'components/map/types'
import { LegendSwatch, IconID } from './types'
import { StoreAction } from '../../context/types'
import { langLabelsStyle } from '../map/config.points' // just need defaults

const createMapLegend = (layers: LayerPropsPlusMeta[]): LegendSwatch[] => {
  return layers.map((layer) => {
    const { id, layout, paint } = layer
    const settings = { legendLabel: id } as LegendSwatch
    const size = layout['icon-size'] ? (layout['icon-size'] as number) * 20 : 5
    const backgroundColor = (paint['icon-color'] as string) || 'transparent'
    const iconID =
      (layout['icon-image'] as IconID) || langLabelsStyle.layout['icon-image']

    return {
      ...settings,
      size,
      backgroundColor,
      iconID,
    }
  })
}

export const initLegend = (
  dispatch: React.Dispatch<StoreAction>,
  activeSymbGroupID: string,
  symbLayers: LayerPropsPlusMeta[]
): void => {
  const layersInActiveGroup = symbLayers.filter(
    ({ group }) => group === activeSymbGroupID
  )
  const legend = createMapLegend(layersInActiveGroup)

  dispatch({ type: 'SET_LANG_LAYER_LEGEND', payload: legend })
}

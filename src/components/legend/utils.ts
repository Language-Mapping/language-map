import { LayerPropsPlusMeta } from 'components/map/types'
import { LegendSwatch, IconID } from './types'
import { langLabelsStyle } from '../map/config.points' // just need defaults
import { Action as SymbLabelAction } from '../../context/SymbAndLabelContext'
import styleConfig from '../map/config.lang-style'

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
  dispatch: React.Dispatch<SymbLabelAction>,
  activeSymbGroupID: string,
  symbLayers: LayerPropsPlusMeta[]
): void => {
  const layersInActiveGroup = symbLayers.filter(
    ({ group }) => group === activeSymbGroupID
  )
  const legend = createMapLegend(layersInActiveGroup)

  dispatch({ type: 'SET_LANG_LAYER_LEGEND', payload: legend })
}

// Dig through the MB style config to find the matching ID. Return icon color.
export const getSwatchColorByConfig = (id: string): string => {
  const matchedConfig = styleConfig.find((config) => config.id === id)

  if (!matchedConfig) return '#444' // better than nothing, JIC

  return matchedConfig.paint['icon-color'] as string
}

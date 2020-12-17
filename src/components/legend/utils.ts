import { LayerPropsPlusMeta } from 'components/map/types'
import { Action as SymbLabelAction } from 'components/context/SymbAndLabelContext'
import * as Types from './types'
import { mapLabelDefaults } from '../map/config.points' // just need defaults
import styleConfig from '../map/config.lang-style'

const createMapLegend = (
  layers: LayerPropsPlusMeta[]
): Types.LegendSwatchBareMin[] => {
  return layers.map((layer) => {
    const { id, layout, paint } = layer
    const settings = { legendLabel: id } as Types.LegendSwatchBareMin
    const size = layout['icon-size'] ? (layout['icon-size'] as number) * 20 : 5
    const backgroundColor = (paint['icon-color'] as string) || 'transparent'
    const iconID =
      (layout['icon-image'] as Types.IconID) ||
      mapLabelDefaults.layout['icon-image']

    return { ...settings, size, backgroundColor, iconID }
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

// Dig through the MB style config to find the matching `id`. Return icon color.
export const getSwatchColorByConfig = (id: string): string => {
  const matchedConfig = styleConfig.find((config) => config.id === id)

  if (!matchedConfig) return '#444' // better than nothing, JIC

  return matchedConfig.paint['icon-color'] as string
}

type Compare<T> = (a: T, b: T) => number // TODO: defeat

const sortArrOfObjects = <T>(key: keyof T): Compare<T> => {
  return (a: T, b: T): number => {
    let comparison = 0

    if (a[key] > b[key]) comparison = 1
    else if (a[key] < b[key]) comparison = -1

    return comparison
  }
}

const finalPrep: Types.FinalPrep = (
  rows,
  labelByField,
  sortByField = 'name'
) => {
  let labeled

  rows.sort(sortArrOfObjects(sortByField))

  if (labelByField)
    labeled = rows.map((row) => ({
      ...row,
      name: row[labelByField],
    })) as Types.AtSymbFields[]
  else labeled = rows

  return labeled
}

export const prepAirtableResponse = (
  rows: Types.AtSymbFields[],
  tableName: string,
  config?: Types.AtSchemaFields
): Types.LegendProps[] => {
  if (!config) return []

  const { groupByField, labelByField } = config

  if (!groupByField)
    return [{ items: finalPrep(rows, labelByField), groupName: tableName }]

  const prepped = rows.reduce((all, thisOne) => {
    const groupName = thisOne[groupByField] as string
    const existing = all[groupName]
    const items = existing ? [...existing.items, thisOne] : [thisOne]

    return { ...all, [groupName]: { groupName, items } }
  }, {} as { [key: string]: Types.LegendProps })

  return Object.keys(prepped)
    .sort() // assumes intent is alphbetical sorting
    .map((group) => {
      const { groupName, items } = prepped[group]

      // Was easier to pass groupName as an object property than to try and mix
      // array/obj (e.g. use key) in the component, so setting it here:
      return {
        groupName,
        items: finalPrep(items.sort(sortArrOfObjects('name')), labelByField),
      }
    })
}

import { Dispatch } from 'react'

import {
  MetadataGroupType,
  LegendSwatchType,
  MbResponseType,
  LayerPropsNonBGlayer,
} from 'components/map/types'
import { initLegend } from 'components/map/utils'
import {
  StoreActionType,
  WpApiPageResponseType,
  AboutPageStateType,
  LangRecordSchema,
} from './context/types'

export const getGroupNames = (groupObject: MetadataGroupType): string[] =>
  Object.keys(groupObject).map((groupId: string) => groupObject[groupId].name)

export const createMapLegend = (
  layers: LayerPropsNonBGlayer[]
): LegendSwatchType[] => {
  return layers.map((layer) => {
    const { type, id, paint, layout } = layer
    const settings = {
      legendLabel: id,
      type,
    } as LegendSwatchType

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

// TODO: react-query
export const getMbStyleDocument = async (
  symbStyleUrl: string,
  dispatch: Dispatch<StoreActionType>,
  setSymbLayers: Dispatch<LayerPropsNonBGlayer[]>,
  setLabelLayers: Dispatch<LayerPropsNonBGlayer[]>
): Promise<void> => {
  const response = await fetch(symbStyleUrl) // TODO: handle errors
  const { metadata, layers: allLayers }: MbResponseType = await response.json()
  const allLayerGroups = metadata['mapbox:groups']
  const nonLabelsGroups: MetadataGroupType = {}
  let labelsGroupId = ''

  for (const key in allLayerGroups) {
    if (allLayerGroups[key].name === 'Labels') {
      labelsGroupId = key
    } else {
      nonLabelsGroups[key] = allLayerGroups[key]
    }
  }

  // Default symbology to show first
  const firstGroupId = Object.keys(nonLabelsGroups)[0]

  const nonBgLayersWithMeta = allLayers.filter(
    (layer) => layer.metadata && layer.type !== 'background'
  )
  const notTheBgLayerOrLabels = nonBgLayersWithMeta.filter(
    (layer) => layer.metadata['mapbox:group'] !== labelsGroupId
  ) as LayerPropsNonBGlayer[]
  const labelsLayers = nonBgLayersWithMeta.filter(
    (layer) => layer.metadata['mapbox:group'] === labelsGroupId
  ) as LayerPropsNonBGlayer[]

  // The field names that will populate the "Label by" dropdown
  const labelFields = labelsLayers.map((layer) => layer.id as string)

  // Populate symb dropdown
  dispatch({
    type: 'INIT_LANG_LAYER_SYMB_OPTIONS',
    payload: nonLabelsGroups,
  })

  // Set group ID of initial active MB Styles group
  dispatch({
    type: 'SET_LANG_LAYER_SYMBOLOGY',
    payload: firstGroupId,
  })

  // Populate labels dropdown
  dispatch({
    type: 'INIT_LANG_LAYER_LABEL_OPTIONS',
    payload: labelFields,
  })

  initLegend(dispatch, firstGroupId, notTheBgLayerOrLabels)
  setLabelLayers(labelsLayers)
  setSymbLayers(notTheBgLayerOrLabels)
}

export const getAboutPageContent = async (
  url: string,
  setAboutPgContent: Dispatch<AboutPageStateType>
): Promise<void> => {
  const response = await fetch(url) // TODO: handle errors
  const { title, content }: WpApiPageResponseType = await response.json()

  setAboutPgContent({
    title: title.rendered,
    content: content.rendered,
  })
}

export const findFeatureByID = (
  langLayerRecords: LangRecordSchema[],
  id: number,
  idField?: keyof LangRecordSchema
): LangRecordSchema | undefined =>
  langLayerRecords.find((record) => record[idField || 'ID'] === id)

export const getIDfromURLparams = (url: string): number => {
  const urlParams = new URLSearchParams(url)
  const idAsString = urlParams.get('id') as string

  return parseInt(idAsString, 10)
}

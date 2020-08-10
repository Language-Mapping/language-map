import { Dispatch } from 'react'

import {
  MetadataGroupType,
  LegendSwatchType,
  MbResponseType,
  LayerPropsPlusMeta,
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
  layers: LayerPropsPlusMeta[]
): LegendSwatchType[] => {
  return layers.map((layer: LayerPropsPlusMeta) => {
    const { type, id } = layer
    const lightGray = '#aaa'

    if (type === 'circle') {
      // TODO: learn how to get past the `CirclePaint` issue, which has
      // properties like `circle-radius` that allow multiple types.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { paint }: { paint: any } = layer

      const backgroundColor = paint['circle-color'] || lightGray
      const size = paint['circle-radius'] || 5

      return {
        shape: 'circle',
        size,
        backgroundColor,
        text: id,
      }
    }

    return {
      shape: 'circle',
      size: 5,
      backgroundColor: lightGray,
      text: id,
    }
  })
}

// TODO: react-query
export const getMbStyleDocument = async (
  symbStyleUrl: string,
  dispatch: Dispatch<StoreActionType>,
  setSymbLayers: Dispatch<LayerPropsPlusMeta[]>,
  setLabelLayers: Dispatch<LayerPropsPlusMeta[]>
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
  const notTheBgLayerOrLabels = allLayers.filter(
    (layer: LayerPropsPlusMeta) =>
      layer.metadata &&
      layer.type !== 'background' &&
      layer.metadata['mapbox:group'] !== labelsGroupId
  )
  const labelsLayers = allLayers.filter(
    (layer: LayerPropsPlusMeta) =>
      layer.metadata && layer.metadata['mapbox:group'] === labelsGroupId
  )

  // The field names that will populate the "Label by" dropdown
  const labelFields = labelsLayers.map(
    (layer: LayerPropsPlusMeta) => layer.id as string
  )

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

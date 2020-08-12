import { Dispatch } from 'react'

import {
  MetadataGroup,
  MbResponse,
  LayerPropsNonBGlayer,
} from 'components/map/types'
import { StoreAction, LangRecordSchema } from './context/types'

export const getGroupNames = (groupObject: MetadataGroup): string[] =>
  Object.keys(groupObject).map((groupId: string) => groupObject[groupId].name)

// TODO: react-query
export const getMbStyleDocument = async (
  symbStyleUrl: string,
  dispatch: Dispatch<StoreAction>,
  setSymbLayers: Dispatch<LayerPropsNonBGlayer[]>,
  setLabelLayers: Dispatch<LayerPropsNonBGlayer[]>
): Promise<void> => {
  const response = await fetch(symbStyleUrl) // TODO: handle errors
  const { metadata, layers: allLayers }: MbResponse = await response.json()
  const allLayerGroups = metadata['mapbox:groups']
  const nonLabelsGroups: MetadataGroup = {}
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

  setLabelLayers(labelsLayers)
  setSymbLayers(notTheBgLayerOrLabels)
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
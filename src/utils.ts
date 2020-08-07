import { Dispatch } from 'react'

import {
  MetadataGroupType,
  LegendSwatchType,
  MbResponseType,
  LayerPropsPlusMeta,
} from 'components/map/types'
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

// TODO: react-query or, at a minimum, get this into utils and maybe run it
// higher up the tree instead.
export const getMbStyleDocument = async (
  styleUrl: string,
  dispatch: Dispatch<StoreActionType>,
  setSymbLayers: Dispatch<LayerPropsPlusMeta[]>,
  setLabelLayers: Dispatch<LayerPropsPlusMeta[]>
): Promise<void> => {
  const response = await fetch(styleUrl) // TODO: handle errors
  // const response = await fetch('/data/mb-styles.langs.json') // TODO: handle errors
  const { metadata, layers: allLayers }: MbResponseType = await response.json()
  const layerGroups = metadata['mapbox:groups']
  // TODO: instead of grabbing the first one, get the first one who has a
  // child layer that is VISIBLE. Alternatively could use the `collapsed`
  // property but that seems unintuitive.
  const firstGroupId = Object.keys(layerGroups)[0]
  let labelsGroupId = ''
  const nonLabelsGroups: MetadataGroupType = {}

  for (const key in layerGroups) {
    if (layerGroups[key].name === 'Labels') {
      labelsGroupId = key
    } else {
      nonLabelsGroups[key] = layerGroups[key]
    }
  }

  // TODO: make this work with icons, which are of type `symbol`
  const notTheBgLayerOrLabels = allLayers.filter(
    (layer: LayerPropsPlusMeta) =>
      layer.metadata && layer.type !== 'background' && layer.type !== 'symbol'
  )
  const labelsLayers = allLayers.filter(
    (layer: LayerPropsPlusMeta) =>
      layer.metadata && layer.metadata['mapbox:group'] === labelsGroupId
  )
  const labels = labelsLayers.map(
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
    payload: labels,
  })

  // TODO: instead of grabbing the first one, get the first VISIBLE layer using
  // `find` instead of filter.
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
  id: string,
  idField?: keyof LangRecordSchema
): LangRecordSchema | undefined =>
  langLayerRecords.find((record) => record[idField || 'ID'] === id)

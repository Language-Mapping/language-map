import {
  MetadataGroupType,
  LegendSwatchType,
  LayerWithMetadata,
} from 'components/map/types'

export const getGroupNames = (groupObject: MetadataGroupType): string[] =>
  Object.keys(groupObject).map((groupId: string) => groupObject[groupId].name)

export const createMapLegend = (
  layers: LayerWithMetadata[]
): LegendSwatchType[] => {
  return layers.map((layer: LayerWithMetadata) => {
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

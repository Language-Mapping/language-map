import { InstanceLevelSchema, useMapToolsState } from 'components/context'
import { AtSymbFields, AtSchemaFields } from 'components/legend/types'
import { layerSymbFields } from 'components/legend/config'
import { useAirtable } from 'components/explore/hooks'
import { useRouteMatch } from 'react-router-dom'
import { iconStyleOverride } from './config'

import * as Types from './types'

export const useLayersConfig = (
  tableName: keyof InstanceLevelSchema
): Types.UseLayersConfig => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const moreFields = layerSymbFields[tableName] || []
  const { baseLayer } = useMapToolsState()
  const { data, isLoading, error } = useAirtable<AtSchemaFields>(tableName, {
    // WOW: field order really matters in regards to react-query. If this is
    // the same as the one being used by legend config, it doesn't load
    // properly on page load
    fields: ['name', ...moreFields],
  })

  let prepped: Types.LayerPropsPlusMeta[] = []

  if (data.length) prepped = createLayerStyles(data, tableName, baseLayer)

  return { error, data: prepped, isLoading }
}

// CRED: fo' spread: https://bit.ly/37nzMRT
// TODO: into utils
const createLayerStyles = (
  rows: AtSymbFields[],
  group: keyof InstanceLevelSchema,
  baseLayer: Types.BaseLayer
): Types.LayerPropsPlusMeta[] =>
  rows.map((settings) => {
    const iconColor = settings['icon-color']
    const textColor =
      settings['text-color'] || (baseLayer !== 'light' && 'white')
    const textHaloColor = settings['text-halo-color']

    return {
      id: settings.name,
      type: 'symbol', // not being used at time of writing, just satisfy TS
      group, // aka Airtable table name, and possibly query ID
      filter: ['match', ['get', group], [settings.name], true, false],
      layout: {
        // Making an assumption that image-based icons will look better with the
        // slightly-larger, placement-ignorant style
        ...(settings['icon-image'] && {
          'icon-image': settings['icon-image'],
          ...iconStyleOverride,
        }),
        ...(!settings['icon-image'] &&
          settings['icon-size'] && { 'icon-size': settings['icon-size'] }),
      },
      paint: {
        ...(iconColor && { 'icon-color': iconColor }),
        ...(textColor && { 'text-color': textColor }),
        ...(textHaloColor && { 'text-halo-color': textHaloColor }),
      },
    }
  })
export const useSelLangPointCoords = (): Types.UseSelLangPointCoordsReturn => {
  const match = useRouteMatch<{ id: string }>({
    path: '/Explore/Language/:language/:id',
    exact: true,
  })

  const { data, error, isLoading } = useAirtable<Types.SelFeatAttribs>(
    'Data',
    {
      fields: ['Latitude', 'Longitude'],
      filterByFormula: `{id} = ${match?.params.id}`,
      maxRecords: 1,
    },
    { enabled: !!match }
  )

  if (isLoading || error) return { lat: null, lon: null }

  return {
    lat: data[0]?.Latitude || null,
    lon: data[0]?.Longitude || null,
  }
}

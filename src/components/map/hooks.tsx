import { WebMercatorViewport } from 'react-map-gl'
import { useTheme } from '@material-ui/core/styles'

import { panelWidths } from 'components/panels/config'
import { LangRecordSchema } from 'components/context'
import { AtSymbFields, AtSchemaFields } from 'components/legend/types'
import { layerSymbFields } from 'components/legend/config'
import { useAirtable } from 'components/explore/hooks'
import { useRouteMatch } from 'react-router-dom'
import * as Types from './types'
import { useWindowResize } from '../../utils'
import { iconStyleOverride } from './config'

// Set offsets to account for the panel-on-map layout as it would otherwise
// expect the map center to be the screen center. Did not find a good way to do
// this on init, so instead it gets used dynamically on each zoom-to-stuff
// scenario. The values are pretty approximate and somewhat fragile as they were
// determined through much trial and error.
export function useOffset(panelOpen: boolean): Types.Offset {
  const { width, height } = useWindowResize()
  const breakpoint = useBreakpoint()
  const bottomBarHeight = 48
  const deskGutter = 24
  const topBarHeightIsh = 75

  let left = 0
  let bottom = deskGutter / 2 // roughly ok on larger screens

  if (panelOpen) {
    if (breakpoint === 'mobile') {
      bottom = (-1 * (height - bottomBarHeight - topBarHeightIsh)) / 4
    } else if (breakpoint === 'huge') {
      left = (width - panelWidths.midLarge - deskGutter * 4) / 4
    } else {
      left = (width - panelWidths.mid + deskGutter * 4) / 4
    }
  } else if (breakpoint === 'mobile') {
    bottom = 0
  }

  return [left, bottom]
}

export function useBreakpoint(): Types.Breakpoint {
  const theme = useTheme()
  const { width } = useWindowResize()

  const { xl, md } = theme.breakpoints.values

  if (width < md) return 'mobile'
  if (width >= xl) return 'huge'

  return 'desktop'
}

export const useInitialViewport: Types.GetWebMercViewport = (params) => {
  const { width, height } = useWindowResize()
  const { bounds, padding } = params

  const coords = { ...params, width, height } // zoom: 14, // need?
  const initMerc = new WebMercatorViewport(coords)
  const initMercBounds = bounds

  return initMerc.fitBounds(initMercBounds, { padding })
}

export const useLayersConfig = (
  tableName: keyof LangRecordSchema | '' | 'None'
): Types.UseLayersConfig => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const moreFields = layerSymbFields[tableName] || []
  const { data, isLoading, error } = useAirtable<AtSchemaFields>(tableName, {
    // WOW: field order really matters in regards to react-query. If this is the
    // same as the one being used by legend config, it doesn't load properly on
    // page load
    fields: ['name', ...moreFields],
  })

  let prepped: Types.LayerPropsPlusMeta[] = []

  if (tableName && tableName !== 'None' && data.length) {
    prepped = createLayerStyles(data, tableName)
  }

  return { error, data: prepped, isLoading }
}

const createLayerStyles = (
  rows: AtSymbFields[],
  group: keyof LangRecordSchema | '' | 'None'
): Types.LayerPropsPlusMeta[] => {
  if (!group || group === 'None') return []

  return rows.map((settings) => {
    const { name: id } = settings

    // CRED: fo' spread: https://bit.ly/37nzMRT
    return {
      id,
      type: 'symbol', // not being used at time of writing, just satisfy TS
      group, // aka Airtable table name, and possibly query ID
      filter: ['match', ['get', group], [id], true, false],
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
        ...(settings['icon-color'] && { 'icon-color': settings['icon-color'] }),
        ...(settings['text-color'] && { 'text-color': settings['text-color'] }),
        ...(settings['text-halo-color'] && {
          'text-halo-color': settings['text-halo-color'],
        }),
      },
    }
  })
}

export type UsePopupFeatDetailsReturn = {
  selFeatAttribs?: Types.SelFeatAttribs
  error: unknown
  isLoading: boolean
}

export const usePopupFeatDetails = (): UsePopupFeatDetailsReturn => {
  const match = useRouteMatch<{ id: string }>({ path: '/details/:id' })
  const fields: Array<Extract<keyof LangRecordSchema, string>> = [
    'Language',
    'Endonym',
    'Latitude',
    'Longitude',
    'id',
    'Font Image Alt',
  ]

  const { data, error, isLoading } = useAirtable<Types.SelFeatAttribs>(
    'Data',
    {
      fields,
      filterByFormula: `{id} = ${match?.params.id}`,
      maxRecords: 1,
    },
    { enabled: !!match }
  )

  if (isLoading || error) return { isLoading, error }

  return { selFeatAttribs: data[0], error, isLoading }
}

import { useContext } from 'react'
import { useQuery } from 'react-query'
import { WebMercatorViewport } from 'react-map-gl'
import { useTheme } from '@material-ui/core/styles'

import { panelWidths } from 'components/panels/config'
import { GlobalContext, LangRecordSchema } from 'components/context'
import * as LegendTypes from 'components/legend'
import { LayerPropsPlusMeta } from 'components/map/types'
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

export const useLangFeatByKeyVal = (
  value?: string,
  convertToInt?: boolean,
  field?: keyof LangRecordSchema
): Types.UseLangReturn => {
  const { state } = useContext(GlobalContext)
  const stateReady = state.langFeatsLenCache !== 0

  if (!value) return { feature: undefined, stateReady }

  const valuePrepped = convertToInt ? parseInt(value, 10) : value

  return {
    feature: state.langFeatures.find(
      (record) => record[field || 'ID'] === valuePrepped
    ),
    stateReady,
  }
}

export const useLayersConfig = (
  tableName: keyof LangRecordSchema | '' | 'None'
): Types.UseLayersConfig => {
  const { data, isLoading, error } = useQuery<LegendTypes.AtSchemaRecord[]>([
    tableName,
    'legend',
  ])

  let prepped: LayerPropsPlusMeta[] = []

  if (data && tableName && tableName !== 'None') {
    prepped = createLayerStyles(
      data.map((row) => row.fields),
      tableName
    )
  }

  // TODO: fix/understand fetching/loading
  return { error, data: prepped, isLoading }
}

export const createLayerStyles = (
  rows: LegendTypes.AtSymbFields[],
  group: keyof LangRecordSchema | '' | 'None'
): LayerPropsPlusMeta[] => {
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

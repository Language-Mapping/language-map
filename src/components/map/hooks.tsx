import { useContext, useEffect, useState } from 'react'
import { useQueryCache, useQuery } from 'react-query'
import * as stats from 'simple-statistics'
import { WebMercatorViewport } from 'react-map-gl'
import { FillPaint, LngLatBounds } from 'mapbox-gl'

import { useTheme } from '@material-ui/core/styles'

import { panelWidths } from 'components/panels/config'
import {
  GlobalContext,
  LangRecordSchema,
  useMapToolsState,
} from 'components/context'
import { AtSymbFields, AtSchemaFields } from 'components/legend/types'
import { layerSymbFields } from 'components/legend/config'
import { useAirtable } from 'components/explore/hooks'
import { useRouteMatch } from 'react-router-dom'
import { SheetsReactQueryResponse } from 'components/config/types'
import { reactQueryDefaults } from 'components/config'
import { useWindowResize, sheetsToJSON } from '../../utils'
import { iconStyleOverride, POINT_ZOOM_LEVEL } from './config'
import { flyToPoint, flyToBounds } from './utils'
import { handleBoundaryClick } from './events'

import * as Types from './types'

import { tableEndpoints } from '../local/config'

import * as utils from './utils'
import { PreppedCensusTableRow } from './types'

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

// Set popup heading and lat/lng for Neighborhood or County click
export const useBoundaryPopup: Types.UseBoundaryPopup = (
  panelOpen,
  clickedBoundary,
  map
) => {
  const cache = useQueryCache()
  const offset = useOffset(panelOpen)

  const [
    boundaryPopup,
    setBoundaryPopup,
  ] = useState<Types.PopupSettings | null>(null)

  useEffect((): void => {
    if (!map || !clickedBoundary) return

    const boundaryData = cache.getQueryData(
      clickedBoundary.source
    ) as Types.BoundaryLookup[]

    const boundaryPopupSettings = handleBoundaryClick(
      map,
      clickedBoundary,
      {
        height: window.innerHeight as number,
        width: window.innerWidth as number,
      },
      boundaryData,
      offset
    )

    if (boundaryPopupSettings) setBoundaryPopup(boundaryPopupSettings)
    // I don't get this rule. It works fine alllll the time here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickedBoundary])

  return boundaryPopup
}

// Fly to extent of lang features on length change
export const useZoomToLangFeatsExtent: Types.UseZoomToLangFeatsExtent = (
  panelOpen,
  map
) => {
  const { state } = useContext(GlobalContext)
  const { langFeatures, langFeatsLenCache } = state
  const offset = useOffset(panelOpen)
  const [shouldFlyHome, setShouldFlyHome] = useState<boolean>(false)

  // Fly to extent of lang features on length change
  useEffect((): void => {
    if (!map || !langFeatures.length) return

    // TODO: better check/decouple the fly-home-on-filter-reset behavior so that
    // there are no surprise fly-to-home scenarios.
    if (langFeatures.length === langFeatsLenCache) {
      setShouldFlyHome(true)

      return
    }

    const firstCoords: [number, number] = [
      langFeatures[0].Longitude,
      langFeatures[0].Latitude,
    ]

    // Zooming to "bounds" gets crazy if there is only one feature
    if (langFeatures.length === 1) {
      flyToPoint(
        map,
        {
          latitude: firstCoords[1],
          longitude: firstCoords[0],
          zoom: POINT_ZOOM_LEVEL,
          pitch: 80,
          offset,
        },
        null
      )

      return
    }

    const bounds = langFeatures.reduce(
      (all, thisOne) => all.extend([thisOne.Longitude, thisOne.Latitude]),
      new LngLatBounds(firstCoords, firstCoords)
    )

    flyToBounds(
      map,
      {
        height: window.innerHeight as number,
        width: window.innerWidth as number,
        bounds: bounds.toArray() as Types.BoundsArray,
        offset,
      },
      null
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [langFeatures.length])

  return shouldFlyHome
}

export const useCensusSymb: Types.UseCensusSymb = (
  sourceLayer,
  censusScope,
  map
) => {
  const { censusActiveField } = useMapToolsState()
  const field = censusActiveField?.id
  const scope = censusActiveField?.scope
  const visible = field !== undefined && censusScope === scope

  // TODO: prevent this from happening before it's actually used
  const { data, error, isLoading } = useQuery(
    `${censusScope}-table`,
    () => utils.asyncAwaitFetch(tableEndpoints[censusScope]),
    reactQueryDefaults
  ) as SheetsReactQueryResponse
  const [fillPaint, setFillPaint] = useState<FillPaint>({
    'fill-color': 'transparent', // mitigates the brief lag before load
  })
  const [highLow, setHighLow] = useState<{ high: number; low?: number }>()
  const [tableRows, setTableRows] = useState<PreppedCensusTableRow[]>()

  useEffect(() => {
    if (isLoading || !data) return

    /* eslint-disable array-bracket-newline */
    const tableRowsPrepped = sheetsToJSON<PreppedCensusTableRow>(data.values, [
      'GEOID',
    ])

    setTableRows(tableRowsPrepped)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])

  useEffect(() => {
    if (!map || !tableRows || !field || !visible) return

    const valuesCurrField = tableRows.map((row) => row[field])
    const means = stats.ckmeans(valuesCurrField, 5)
    const firstItemLastClass = means[4][0]
    const max = stats.max(valuesCurrField)

    // TODO: rm if not using min
    // low: (firstItemLastClass / stats.min(valuesCurrField)) * 100,
    setHighLow({ high: (firstItemLastClass / max) * 100 })

    tableRows.forEach((row) => {
      const featConfig = { source: censusScope, sourceLayer, id: row.GEOID }
      const total = row[field]

      map.setFeatureState(featConfig, {
        total: (total / max) * 100,
      } as { total: number })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field])

  useEffect(() => {
    if (!highLow) return

    setFillPaint(utils.setInterpolatedFill(highLow.high, highLow.low))
  }, [highLow])

  return { fillPaint, visible, error, isLoading }
}

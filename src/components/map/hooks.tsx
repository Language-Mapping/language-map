import { useContext, useEffect, useState } from 'react'
import { WebMercatorViewport } from 'react-map-gl'
import { FillPaint, LngLatBounds } from 'mapbox-gl'
import { useTheme } from '@material-ui/core/styles'
import * as stats from 'simple-statistics'

import { panelWidths } from 'components/panels/config'
import {
  GlobalContext,
  InstanceLevelSchema,
  useMapToolsState,
} from 'components/context'
import { AtSymbFields, AtSchemaFields } from 'components/legend/types'
import { layerSymbFields } from 'components/legend/config'
import { useAirtable } from 'components/explore/hooks'
import { useLocation, useRouteMatch } from 'react-router-dom'
import { AIRTABLE_CENSUS_BASE } from 'components/config'
import { routes } from 'components/config/api'
import { usePanelState } from 'components/panels'
import { useWindowResize } from '../../utils'
import {
  allPolyLayersConfig,
  iconStyleOverride,
  POINT_ZOOM_LEVEL,
} from './config'
import { flyToPoint, flyToBounds } from './utils'

import * as Types from './types'
import * as utils from './utils'

// Set offsets to account for the panel-on-map layout as it would otherwise
// expect the map center to be the screen center. Did not find a good way to do
// this on init, so instead it gets used dynamically on each zoom-to-stuff
// scenario. The values are pretty approximate and somewhat fragile as they were
// determined through much trial and error.
export function useOffset(): Types.Offset {
  const { panelOpen } = usePanelState()
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
  tableName: keyof InstanceLevelSchema
): Types.UseLayersConfig => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const moreFields = layerSymbFields[tableName] || []
  const { data, isLoading, error } = useAirtable<AtSchemaFields>(tableName, {
    // WOW: field order really matters in regards to react-query. If this is
    // the same as the one being used by legend config, it doesn't load
    // properly on page load
    fields: ['name', ...moreFields],
  })

  let prepped: Types.LayerPropsPlusMeta[] = []

  if (data.length) prepped = createLayerStyles(data, tableName)

  return { error, data: prepped, isLoading }
}

const createLayerStyles = (
  rows: AtSymbFields[],
  group: keyof InstanceLevelSchema
): Types.LayerPropsPlusMeta[] =>
  // CRED: fo' spread: https://bit.ly/37nzMRT
  rows.map((settings) => ({
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
      ...(settings['icon-color'] && { 'icon-color': settings['icon-color'] }),
      ...(settings['text-color'] && { 'text-color': settings['text-color'] }),
      ...(settings['text-halo-color'] && {
        'text-halo-color': settings['text-halo-color'],
      }),
    },
  }))

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

export const usePolygonWebMerc: Types.UsePolygonWebMerc = (
  routePath,
  tableName
) => {
  const match = useRouteMatch<{ id?: string }>({
    path: routePath,
    exact: true,
  })
  const isCensus = ['puma', 'tract'].includes(tableName)
  const filterField = isCensus ? 'GEOID' : 'name'
  const filterValue = match?.params.id

  const { data, isLoading, error } = useAirtable<
    Types.NeighborhoodTableSchema | Types.CountyTableSchema
  >(
    tableName,
    {
      fields: ['x_max', 'x_min', 'y_min', 'y_max'],
      filterByFormula: `{${filterField}} = "${filterValue}"`,
      maxRecords: 1,
      ...(isCensus && { baseID: AIRTABLE_CENSUS_BASE }),
    },
    { enabled: !!match }
  )

  if (isLoading || error || !data.length)
    return { x_max: null, x_min: null, y_min: null, y_max: null }

  return {
    x_max: data[0].x_max,
    x_min: data[0].x_min,
    y_min: data[0].y_min,
    y_max: data[0].y_max,
  }
}

// Fly to extent of lang features on length change
export const useZoomToLangFeatsExtent: Types.UseZoomToLangFeatsExtent = (
  isMapTilted,
  map
) => {
  const { state } = useContext(GlobalContext)
  const { langFeatures, langFeatsLenCache } = state
  const offset = useOffset()
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
      flyToPoint(map, {
        latitude: firstCoords[1],
        longitude: firstCoords[0],
        zoom: POINT_ZOOM_LEVEL,
        pitch: isMapTilted ? 80 : 0,
        offset,
      })

      return
    }

    const bounds = langFeatures.reduce(
      (all, thisOne) => all.extend([thisOne.Longitude, thisOne.Latitude]),
      new LngLatBounds(firstCoords, firstCoords)
    )

    flyToBounds(map, {
      height: window.innerHeight as number,
      width: window.innerWidth as number,
      bounds: bounds.toArray() as Types.BoundsArray,
      offset,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [langFeatures.length])

  return shouldFlyHome
}

export const useCensusSymb: Types.UseCensusSymb = (
  sourceLayer,
  censusScope,
  map
) => {
  const { pathname } = useLocation()
  const { censusActiveField } = useMapToolsState()
  const { id: field, scope } = censusActiveField || {}
  const visible = field !== undefined && censusScope === scope
  const queryID = scope || 'tract'

  // DUUUDE useRouteMatch
  const pathDeservesFetch =
    pathname.includes(routes.local) ||
    pathname.includes('/Explore/Language/') || // TODO: super-confirm it works
    pathname.includes(routes.explore)

  const { data, error, isLoading } = useAirtable<Types.CensusTableRow>(
    queryID,
    // Foregoing 'fields' because SLOW due to 100 records/sec Airtable limit
    { baseID: AIRTABLE_CENSUS_BASE },
    // TODO: some kind of prefetch. But at least this isn't on load:
    { refetchOnMount: true, enabled: pathDeservesFetch || field !== undefined }
  )

  const [fillPaint, setFillPaint] = useState<FillPaint>({
    'fill-color': 'transparent', // mitigates the brief lag before load
  })
  const [highLow, setHighLow] = useState<{ high: number; low?: number }>()

  useEffect(() => {
    if (!map || isLoading || !data.length || !field || !visible) return

    const valuesCurrField = data.map((row) => row[field])
    const means = stats.ckmeans(valuesCurrField, 5)
    const firstItemLastClass = means[4][0]
    const max = stats.max(valuesCurrField)

    // TODO: rm if not using min
    // low: (firstItemLastClass / stats.min(valuesCurrField)) * 100,
    setHighLow({ high: (firstItemLastClass / max) * 100 })

    data.forEach((row) => {
      const featConfig = { source: censusScope, sourceLayer, id: row.GEOID }
      const total = row[field]

      map.setFeatureState(featConfig, {
        total: (total / max) * 100,
      } as { total: number })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field, isLoading, pathname])

  useEffect(() => {
    if (!highLow) return

    setFillPaint(utils.setInterpolatedFill(highLow.high, highLow.low))
  }, [highLow])

  return { fillPaint, visible, error, isLoading }
}

export const useZoomToBounds: Types.UseZoomToBounds = (
  routePath,
  tableName,
  mapLoaded,
  map
) => {
  const selPolyBounds = usePolygonWebMerc(routePath, tableName)
  const { x_max: xMax, x_min: xMin, y_min: yMin, y_max: yMax } = selPolyBounds
  const offset = useOffset()

  // Zoom to selected feature extent
  useEffect(() => {
    if (!map || !mapLoaded || !xMax || !xMin || !yMin || !yMax) return

    const boundsArray = [
      [xMin, yMin],
      [xMax, yMax],
    ] as Types.BoundsArray

    const webMercViewport = utils.getPolyWebMercView(boundsArray, offset)
    const zoom = Math.min(webMercViewport.zoom, POINT_ZOOM_LEVEL) // tracts are too small

    flyToPoint(map, { ...webMercViewport, offset, zoom })

    // LEGIT. selPolyBounds as a dep will break the world.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapLoaded, xMax, xMin, yMin, yMax, map])
}

// TODO: make it not insanely fragile, or abandon hover stuff on polygons
export const useFeatSrcFromMatch: Types.UseRenameLaterUgh = () => {
  const neighbsMatch = useRouteMatch<{ id: string }>({
    path: ['/Explore/Neighborhood/:id', '/Explore/Neighborhood/:id/:something'],
    exact: true,
  })

  const countiesMatch = useRouteMatch<{ id: string }>({
    path: ['/Explore/County/:id', '/Explore/County/:id/:something'],
    exact: true,
  })

  const featID = neighbsMatch?.params.id || countiesMatch?.params.id

  if (!featID) return undefined

  return { featID, srcID: neighbsMatch ? 'neighborhoods' : 'counties' }
}

export const usePolySelFeatSymb: Types.UsePolySelFeatSymb = (settings) => {
  const { map, mapLoaded, configKey } = settings
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore // TODO: come on
  const layerConfig = allPolyLayersConfig[configKey]
  const { sourceID, sourceLayer, routePath, visContextKey } = layerConfig

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const visible = useMapToolsState()[visContextKey]
  // TODO: show at next level, e.g. /Explore/Neighborhood/Astoria/Something
  const match = useRouteMatch<{ id: string }>({ path: routePath, exact: true })
  const valueParam = match?.params.id

  // Clear/set selected feature state
  useEffect(() => {
    if (!map || !mapLoaded) return

    map.removeFeatureState({ source: sourceID, sourceLayer }) // clear each time

    if (valueParam) {
      map.setFeatureState(
        {
          sourceLayer,
          source: sourceID,
          id: valueParam,
        },
        { selected: true }
      )
    }
    // Definitely need `mapLoaded`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, mapLoaded, match, valueParam, visible])
}

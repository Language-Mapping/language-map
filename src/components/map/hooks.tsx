import { useContext, useEffect, useState } from 'react'
import { FillPaint, LngLatBounds } from 'mapbox-gl'
import * as stats from 'simple-statistics'

import {
  GlobalContext,
  useMapToolsState,
  useMapToolsDispatch,
} from 'components/context'
import { useAirtable } from 'components/explore/hooks'
import { useLocation, useRouteMatch } from 'react-router-dom'
import { AIRTABLE_CENSUS_BASE } from 'components/config'
import { routes } from 'components/config/api'
import { useBreakpoint } from 'components/generic'
import { allPolyLayersConfig, POINT_ZOOM_LEVEL } from './config'
import { flyToPoint, flyToBounds } from './utils'

import * as Types from './types'
import * as utils from './utils'

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
export const useFlyToFilteredFeats: Types.UseZoomToLangFeatsExtent = (
  isMapTilted,
  map
) => {
  const { state } = useContext(GlobalContext)
  const { langFeatures, langFeatsLenCache, filterHasRun } = state
  const [shouldFlyHome, setShouldFlyHome] = useState<boolean>(false)
  const breakpoint = useBreakpoint()

  // Fly to extent of lang features on length change
  useEffect((): void => {
    if (!map) return

    // User hasn't filtered yet
    if (!filterHasRun) {
      setShouldFlyHome(true)

      return
    }

    // Features are filtered out or not loaded yet
    if (!langFeatures.length || !langFeatsLenCache) return

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
      })

      return
    }

    const bounds = langFeatures.reduce(
      (all, thisOne) => all.extend([thisOne.Longitude, thisOne.Latitude]),
      new LngLatBounds(firstCoords, firstCoords)
    )

    flyToBounds(map, {
      height: map.getContainer().offsetHeight,
      width: map.getContainer().offsetWidth,
      bounds: bounds.toArray() as Types.BoundsArray,
      breakpoint,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [langFeatures.length])

  return shouldFlyHome
}

export const useCensusSymb: Types.UseCensusSymb = (
  sourceLayer,
  censusScope,
  mapLoaded,
  map
) => {
  const mapToolsDispatch = useMapToolsDispatch()
  const { pathname } = useLocation()
  const { censusActiveField, baseLayer } = useMapToolsState()
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
  const { high, low } = highLow || {} // avoid useEffect "complex deps" warning

  useEffect(() => {
    if (!map || !mapLoaded || isLoading || !data.length || !field || !visible)
      return

    const valuesCurrField = data.map((row) => row[field])
    const means = stats.ckmeans(valuesCurrField, 5)
    const firstItemLastClass = means[4][0]
    const max = stats.max(valuesCurrField)

    // TODO: rm if not using min
    // low: (firstItemLastClass / stats.min(valuesCurrField)) * 100,
    setHighLow({ high: (firstItemLastClass / max) * 100 })
    mapToolsDispatch({
      type: 'SET_CENSUS_HIGH_LOW',
      payload: { high: max, low: 0 },
    })

    data.forEach((row) => {
      const featConfig = { source: censusScope, sourceLayer, id: row.GEOID }
      const total = row[field]

      map.setFeatureState(featConfig, {
        total: (total / max) * 100,
      } as { total: number })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field, isLoading, pathname, mapLoaded, baseLayer])

  useEffect(() => {
    if (!highLow) return

    setFillPaint(utils.setInterpolatedFill(highLow.high, highLow?.low))
  }, [high, highLow, low])

  return { fillPaint, visible, error, isLoading }
}

export const useZoomToBounds: Types.UseZoomToBounds = (
  routePath,
  tableName,
  mapLoaded,
  map
) => {
  const breakpoint = useBreakpoint()
  const selPolyBounds = usePolygonWebMerc(routePath, tableName)
  const { x_max: xMax, x_min: xMin, y_min: yMin, y_max: yMax } = selPolyBounds

  // Zoom to selected feature extent
  useEffect(() => {
    const noBounds = !xMax || !xMin || !yMin || !yMax
    if (!map || !mapLoaded || noBounds) return

    const bounds = [
      [xMin, yMin] as [number, number],
      [xMax, yMax] as [number, number],
    ] as Types.BoundsArray

    const height = map.getContainer().offsetHeight
    const width = map.getContainer().offsetWidth

    flyToBounds(map, { height, width, bounds, breakpoint })

    // LEGIT. offset and selPolyBounds as a dep will break the world.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xMax, xMin, yMin, yMax, map, mapLoaded])
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
  const { map, configKey } = settings
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore // TODO: come on
  const layerConfig = allPolyLayersConfig[configKey]
  const { sourceID, sourceLayer, routePath, visContextKey } = layerConfig

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const visible = useMapToolsState()[visContextKey]
  // TODO: show at next level? e.g. /Explore/Neighborhood/Astoria/Something
  const match = useRouteMatch<{ id: string }>({ path: routePath, exact: true })
  const valueParam = match?.params.id
  const isStyleLoaded = map?.isStyleLoaded()

  // Clear/set selected feature state
  useEffect(() => {
    if (!map || !isStyleLoaded) return

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
  }, [map, isStyleLoaded, match, valueParam, visible, sourceID, sourceLayer])
}

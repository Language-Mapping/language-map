import { WebMercatorViewport } from 'react-map-gl'
import { useTheme } from '@material-ui/core/styles'

import { panelWidths } from 'components/panels/config'
import * as Types from './types'
import { useWindowResize } from '../../utils'

export function useOffset(panelOpen: boolean): Types.Offset {
  const { width, height } = useWindowResize()
  const breakpoint = useBreakpoint()
  const bottomBarHeight = 48

  let left = 0
  let bottom = 0

  if (panelOpen) {
    if (breakpoint === 'mobile') {
      const topBarHeightIsh = 75
      bottom = (-1 * (height - bottomBarHeight - topBarHeightIsh)) / 4
    } else if (breakpoint === 'huge') {
      left = panelWidths.midLarge / 2 - 24
    } else {
      left = panelWidths.mid / 2 - 24
    }
  } else if (breakpoint === 'mobile') {
    bottom = -1 * (height / 4 - bottomBarHeight)
  } else {
    left = width
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

  const coords = {
    ...params,
    width,
    height,
    // zoom: 14, // need?
  }

  const initMerc = new WebMercatorViewport(coords)
  const initMercBounds = bounds

  return initMerc.fitBounds(initMercBounds, { padding })
}

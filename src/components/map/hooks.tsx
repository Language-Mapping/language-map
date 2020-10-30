import { WebMercatorViewport } from 'react-map-gl'
import { useTheme } from '@material-ui/core/styles'

import { panelWidths } from 'components/panels/config'
import * as Types from './types'
import { useWindowResize } from '../../utils'

type Breakpoint = 'mobile' | 'desktop' | 'huge'
type PaddingXY = { left: number; bottom: number; right: number; top: number }

export function usePadding(panelOpen: boolean): PaddingXY {
  const { width, height } = useWindowResize()
  const breakpoint = useBreakpoint()

  const right = 0
  const top = 0
  let left = 0
  let bottom = 0

  const bottomBarHeight = 56

  if (panelOpen) {
    if (breakpoint === 'mobile') {
      bottom = (-1 * height) / 4 + 50 // account for logo/title
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

  // TODO: rm top and right if not needed
  return { left, bottom, top, right }
}

export function useBreakpoint(): Breakpoint {
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

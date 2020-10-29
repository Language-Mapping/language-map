import { WebMercatorViewport } from 'react-map-gl'
import { useTheme } from '@material-ui/core/styles'

import { panelWidths } from 'components/panels/config'
import * as Types from './types'
import { useWindowResize } from '../../utils'

export const useIt = false

type Breakpoint = 'mobile' | 'desktop' | 'huge'

type PaddingXY = { left: number; top: number }

export function usePadding(panelClosed?: boolean): PaddingXY {
  const { height } = useWindowResize()
  const breakpoint = useBreakpoint()

  let left = 0
  let top = 0

  const bottomBarHeight = 56

  if (breakpoint === 'mobile') top = (-1 * (height - bottomBarHeight)) / 2
  else if (breakpoint === 'huge') left = panelWidths.midLarge
  else left = panelWidths.mid

  if (panelClosed) return { left, top }

  if (breakpoint === 'mobile') top *= -1

  return { left, top }
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

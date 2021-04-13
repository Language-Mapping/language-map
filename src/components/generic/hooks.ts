import { useRef, useState, useCallback, useEffect } from 'react'
import { useTheme } from '@material-ui/core/styles'
import { useAirtable } from 'components/explore/hooks'
import { useLocation, useRouteMatch } from 'react-router-dom'
import { routes } from 'components/config'
import { UItextTableID, UseUItext, Breakpoint } from './types'
import { useWindowResize } from '../../utils'

export const useUItext = (id: UItextTableID): UseUItext => {
  const { data, isLoading, error } = useAirtable<{ text?: string }>('UI Text', {
    fields: ['text'],
    filterByFormula: `{id} = "${id}"`,
    maxRecords: 1,
  })

  return {
    error,
    isLoading,
    text: data[0]?.text || '',
  }
}

// CRED: for much of this challenging scroll stuff!
// https://stackoverflow.com/questions/36207398
// https://github.com/mui-org/material-ui/issues/12337#issuecomment-487200865

function getScrollY(scroller: HTMLElement | null): number {
  if (!scroller) return window.pageYOffset
  if (scroller.scrollTop !== undefined) return scroller.scrollTop

  return (document.documentElement || document.body.parentNode || document.body)
    .scrollTop
}

export const useHideOnScroll = (
  panelRefElem: React.RefObject<HTMLDivElement | null>,
  threshold = 100 // prevents mobile weirdness on things like Census dropdown
): boolean => {
  const scrollRef = useRef<number>(0)
  const [hide, setHide] = useState(false)
  const loc = useLocation()
  const { pathname, hash } = loc

  const handleScroll = useCallback(() => {
    const scrollY = getScrollY(panelRefElem.current)
    scrollRef.current = scrollY

    setHide(scrollY > threshold)
  }, [panelRefElem, threshold])

  // Show on each pathname change, otherwise it stays hidden
  useEffect(() => {
    setHide(false)
  }, [pathname])

  useEffect(() => {
    if (hash) setHide(true)
  }, [hash]) // hash makes it work for Help and About anchors

  useEffect(() => {
    if (!panelRefElem) return

    panelRefElem.current?.addEventListener('scroll', handleScroll)

    // TODO: just warnings, but resolve both of these if possible
    // eslint-disable-next-line consistent-return
    return function cleanup() {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      panelRefElem.current?.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll, panelRefElem, threshold])

  return hide
}

export function useBreakpoint(): Breakpoint {
  const theme = useTheme()
  const { width } = useWindowResize()

  const { md, sm, lg } = theme.breakpoints.values

  if (width < sm) return 'mobile'
  if (width < md) return 'tablet'
  if (width < lg) return 'desktop'

  return 'huge'
}

export const usePageTitle = (): void => {
  const loc = useLocation()
  const { pathname } = loc

  const detailsMatch = useRouteMatch<{ id: string }>({
    exact: true,
    path: [routes.dataDetail, routes.details],
  })

  const noFeatSelMatch = useRouteMatch({ exact: true, path: routes.none })
  const censusDetailMatch = useRouteMatch<{ table: string }>({
    exact: true,
    path: routes.censusDetail,
  })

  useEffect(() => {
    const asArray = pathname.split('/')
    const pageTitleViaPath: string =
      asArray[4] || asArray[3] || asArray[2] || asArray[1]

    if (noFeatSelMatch) document.title = 'No site selected - NYC Languages'
    else if (censusDetailMatch)
      document.title = `Census (${censusDetailMatch.params.table}) - NYC Languages`
    // Default Home title // TODO: set this for reuse somewhere if needed
    else if (!pageTitleViaPath) document.title = 'Languages of New York City'
    // Everything else gets the first available path segment, except for detail
    // view via Details or Table.
    else if (!detailsMatch?.params.id) {
      // CRED: https://flaviocopes.com/how-to-uppercase-first-letter-javascript/
      const pageTitleCapitalized =
        pageTitleViaPath.charAt(0).toUpperCase() + pageTitleViaPath.slice(1)

      document.title = `${pageTitleCapitalized} - NYC Languages`
    }
  }, [censusDetailMatch, detailsMatch, noFeatSelMatch, pathname])

  // TODO: try to get full-full view on mobile:
  // React.useEffect(() => { window.scrollTo(0, 1) }, [])
}

export const useScrollOnPathChange = (targetElemID: string): void => {
  const { pathname } = useLocation()

  useEffect(() => {
    const anchor = document.querySelector(`#${targetElemID}`)

    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [pathname, targetElemID])
}

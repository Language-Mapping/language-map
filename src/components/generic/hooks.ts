import { useRef, useState, useCallback, useEffect } from 'react'
import { useAirtable } from 'components/explore/hooks'
import { useLocation } from 'react-router-dom'
import { UItextTableID, UseUItext } from './types'

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

// CRED: for all of this challenging scroll stuff!
// https://stackoverflow.com/questions/36207398
// https://github.com/mui-org/material-ui/issues/12337#issuecomment-487200865

function getScrollY(scroller: HTMLElement | null): number {
  if (!scroller) return window.pageYOffset
  if (scroller.scrollTop !== undefined) return scroller.scrollTop

  return (document.documentElement || document.body.parentNode || document.body)
    .scrollTop
}

export const useHideOnScroll = (
  panelRefElem: HTMLDivElement | null,
  threshold = 150 // prevents mobile weirdness on things like Census dropdown
): boolean => {
  const scrollRef = useRef<number>(0)
  const [hide, setHide] = useState(false)
  const loc = useLocation()
  const { pathname, hash } = loc

  const handleScroll = useCallback(() => {
    const scrollY = getScrollY(panelRefElem)
    const prevScrollY = scrollRef.current

    scrollRef.current = scrollY

    let shouldHide = false

    if (scrollY > prevScrollY && scrollY > threshold) {
      shouldHide = true
    }

    setHide(shouldHide)
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

    panelRefElem.addEventListener('scroll', handleScroll)

    // TODO: resolve someday
    // eslint-disable-next-line consistent-return
    return function cleanup() {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll, panelRefElem, threshold])

  return hide
}

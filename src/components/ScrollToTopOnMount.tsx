import { FC, useEffect } from 'react'

// TODO: possibly this for preserving panel scroll position:
// https://codesandbox.io/s/m72wvynqr9?file=/src/useScroll.js

export const ScrollToTopOnMount: FC<{ elemID: string }> = (props) => {
  const { elemID } = props

  useEffect(() => {
    const elem = document.getElementById(elemID)

    // Satisfy headless tests
    if (elem && elem.scrollIntoView)
      elem.scrollIntoView({
        block: 'end',
        behavior: 'smooth',
      })
  }, [elemID])

  return null
}

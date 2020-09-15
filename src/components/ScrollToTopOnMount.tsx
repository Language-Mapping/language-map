import { FC, useEffect } from 'react'

// TODO: possibly this for preserving panel scroll position:
// https://codesandbox.io/s/m72wvynqr9?file=/src/useScroll.js

type ScrollToTopProps = { elemID: string; trigger?: any }

export const ScrollToTopOnMount: FC<ScrollToTopProps> = (props) => {
  const { elemID, trigger } = props

  useEffect(
    () => {
      const elem = document.getElementById(elemID)

      // Satisfy headless tests
      if (elem && elem.scrollIntoView)
        elem.scrollIntoView({
          block: 'end',
          behavior: 'smooth',
        })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    trigger ? [elemID, trigger] : [elemID]
  )

  return null
}

import { FC, useEffect } from 'react'

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

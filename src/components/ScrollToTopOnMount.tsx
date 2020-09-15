import { FC, useEffect } from 'react'

export const ScrollToTopOnMount: FC<{ elemID: string }> = (props) => {
  const { elemID } = props

  useEffect(() => {
    const elem = document.getElementById(elemID)

    if (elem)
      elem.scrollIntoView({
        block: 'end',
        behavior: 'smooth',
      })
  }, [elemID])

  return null
}

import React, { FC } from 'react'
import { MediaChildProps } from './types'
import { useStyles } from './styles'

export const IframeContainer: FC<MediaChildProps> = (props) => {
  const classes = useStyles({})
  const { url, title } = props

  // Proper syntax:
  // https://www.youtube.com/embed/VIDEO_ID
  // https://www.youtube.com/embed/videoseries?list=LIST_ID
  const urlPrepped = url.replace(
    'https://www.youtube.com/playlist',
    'https://www.youtube.com/embed/videoseries'
  )

  return (
    <div className={classes.videoContainer}>
      <iframe
        title={title}
        src={urlPrepped}
        frameBorder="0"
        allow="encrypted-media"
        allowFullScreen
      />
    </div>
  )
}

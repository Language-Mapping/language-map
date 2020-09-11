import React, { FC } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'

import { correctDropboxURL } from '../../utils' // TODO: put back if needed

type EndoImageComponent = {
  url: string
  alt: string
}

const useStyles = makeStyles(() =>
  createStyles({
    endoImage: {
      height: 120,
      maxWidth: '95%',
    },
  })
)

// Mongolian, ASL, etc. have URLs to images
export const EndoImageWrap: FC<EndoImageComponent> = (props) => {
  const classes = useStyles()
  const { url: origUrl, alt } = props
  const url = correctDropboxURL(origUrl)

  return <img src={url} alt={alt} className={classes.endoImage} />
}

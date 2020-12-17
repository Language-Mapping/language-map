import React, { FC } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'

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
  const { url, alt } = props

  return <img src={url} alt={alt} className={classes.endoImage} />
}

import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    recDescripRoot: {
      fontFamily: theme.typography.h1.fontFamily,
      marginTop: theme.spacing(2),
      color: theme.palette.grey[800],
    },
    firstLetter: {
      color: theme.palette.common.black,
      fontSize: theme.typography.h1.fontSize,
      fontFamily: theme.typography.h1.fontFamily,
      fontWeight: theme.typography.h1.fontWeight,
      lineHeight: 0,
    },
    closeBtn: {
      position: 'absolute',
      zIndex: 1,
      top: theme.spacing(1),
      right: theme.spacing(1),
    },
  })
)

export const RecordDescription: FC<{ text: string }> = (props) => {
  const classes = useStyles()
  const { text } = props

  return (
    <Typography className={classes.recDescripRoot}>
      {text && (
        <>
          <span className={classes.firstLetter}>{text[0]}</span>
          {text.slice(1)}
        </>
      )}
      {!text && 'No description available'}
    </Typography>
  )
}

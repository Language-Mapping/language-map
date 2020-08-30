import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    recDescripRoot: {
      fontFamily: theme.typography.h1.fontFamily,
      marginTop: theme.spacing(2),
    },
    firstLetter: {
      display: 'inline-block',
      fontSize: theme.typography.h1.fontSize,
      fontFamily: theme.typography.h1.fontFamily,
      fontWeight: theme.typography.h1.fontWeight,
      lineHeight: 0,
      marginRight: 4,
      marginTop: '1rem',
    },
    body: {
      fontSize: '0.85em',
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
          <span className={classes.body}>{text.slice(1)}</span>
        </>
      )}
      {!text && 'No description available'}
    </Typography>
  )
}

/* eslint-disable react/display-name */
import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    recDescRoot: {
      padding: `${theme.spacing(6)}px ${theme.spacing(1)}px`,
      maxWidth: '100vw',
      marginTop: theme.spacing(1),
      [theme.breakpoints.up('sm')]: {
        maxWidth: 600,
      },
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    yarr: {
      fontFamily: theme.typography.h1.fontFamily,
      color: theme.palette.grey[700],
    },
    firstLetter: {
      color: 'initial',
      fontSize: theme.typography.h1.fontSize,
      fontFamily: theme.typography.h1.fontFamily,
      fontWeight: theme.typography.h1.fontWeight,
      lineHeight: 0,
    },
  })
)

type RecordDescripComponent = {
  text: string
}

export const RecordDescription: FC<RecordDescripComponent> = ({
  text,
}: {
  text: string
}) => {
  const classes = useStyles()

  return (
    <div className={classes.recDescRoot}>
      <Typography variant="subtitle2" className={classes.yarr}>
        {text && (
          <>
            <span className={classes.firstLetter}>{text[0]}</span>
            {text.slice(1)}
          </>
        )}
        {!text && 'No description available'}
      </Typography>
    </div>
  )
}

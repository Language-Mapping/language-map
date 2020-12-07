import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

import { createMarkup, isAlpha } from '../../utils'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      fontFamily: theme.typography.h1.fontFamily,
      marginTop: '0.5em',
      whiteSpace: 'pre-line',
    },
    firstLetter: {
      float: 'left',
      fontFamily: theme.typography.h2.fontFamily,
      fontSize: '3.6em',
      fontWeight: theme.typography.h2.fontWeight,
      lineHeight: 0.75,
      marginRight: '0.1em',
    },
    body: {
      fontSize: '0.85em',
    },
    closeBtn: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      zIndex: 1,
    },
  })
)

const FancyFirstLetter: FC<{ text: string }> = (props) => {
  const classes = useStyles()
  const { text } = props

  if (isAlpha(text)) return <span className={classes.firstLetter}>{text}</span>

  return <>{text}</>
}

export const RecordDescription: FC<{ text: string }> = (props) => {
  const classes = useStyles()
  const { text } = props
  const firstChar = text[0]
  const firstCharAlpha = isAlpha(firstChar)

  return (
    <Typography className={classes.root}>
      {firstCharAlpha && <FancyFirstLetter text={firstChar} />}
      <span
        className={classes.body}
        dangerouslySetInnerHTML={createMarkup(
          firstCharAlpha ? text.slice(1) : text
        )}
      />
      {!text && (
        <div style={{ textAlign: 'center' }}>No description available</div>
      )}
    </Typography>
  )
}

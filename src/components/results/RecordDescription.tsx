import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

import { createMarkup, isAlpha } from '../../utils'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    recDescripRoot: {
      fontFamily: theme.typography.h1.fontFamily,
      marginTop: theme.spacing(2),
      whiteSpace: 'pre-line',
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
    <Typography className={classes.recDescripRoot}>
      {firstCharAlpha && <FancyFirstLetter text={firstChar} />}
      <span
        className={classes.body}
        // eslint-disable-next-line react/no-danger
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

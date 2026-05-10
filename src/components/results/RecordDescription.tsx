import React, { FC } from 'react'
import { Theme } from '@mui/material/styles'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import { Typography } from '@mui/material'

import { MarkdownWithRouteLinks } from 'components/generic'
import { isAlpha } from '../../utils'
import { RecordDescriptionProps } from './types'
import { useDescription } from './hooks'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      fontFamily: theme.typography.h1.fontFamily,
      whiteSpace: 'pre-line',
    },
    firstLetter: {
      float: 'left',
      fontFamily: theme.typography.h2.fontFamily,
      fontSize: '4rem',
      fontWeight: theme.typography.h2.fontWeight,
      lineHeight: 0.75,
      marginRight: '0.4rem',
    },
    body: {
      fontSize: '0.95rem',
      '& p': {
        lineHeight: 1.75,
      },
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

// The standalone description section of Details
export const RecordDescription: FC<RecordDescriptionProps> = (props) => {
  const classes = useStyles()
  const { descriptionID, descripTable } = props
  const { data, isLoading, error } = useDescription(descripTable, descriptionID)

  if (isLoading || error || !data.length) return null

  const { Description } = data[0]
  const firstChar = Description[0]
  const firstCharAlpha = isAlpha(firstChar)

  return (
    <Typography className={classes.root} component="div">
      {firstCharAlpha && <FancyFirstLetter text={firstChar} />}
      <div className={classes.body}>
        <MarkdownWithRouteLinks
          rootElemType="p"
          text={firstCharAlpha ? Description.slice(1) : Description}
        />
      </div>
    </Typography>
  )
}

import React, { FC } from 'react'
import { isMobile } from 'react-device-detect'
import { Link as RouterLink } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Paper } from '@material-ui/core'

import * as Types from './types'

const useStyles = makeStyles((theme: Theme) => {
  const desktopStyles = {
    '&:hover': {
      backgroundColor: isMobile ? 'unset' : theme.palette.grey[800],
    },
  }

  return createStyles({
    chip: {
      alignItems: 'center',
      backgroundColor: theme.palette.grey[700],
      borderRadius: 5,
      cursor: 'pointer',
      display: 'inline-flex',
      lineHeight: 1.5,
      marginBottom: '0.25rem', // otherwise crowded when wrapped
      padding: '0.1rem 0.35rem',
      transition: '300ms background-color ease',
      whiteSpace: 'nowrap',
      fontSize: '0.7rem',
      ...(!isMobile && desktopStyles),
      '& img, svg': {
        marginRight: '0.35rem',
      },
      '& > svg': {
        fontSize: '0.8rem',
        marginRight: '0.25rem',
      },
      '& .country-flag': {
        // Ensure outer white shapes are seen
        outline: `solid 1px ${theme.palette.divider}`,
        height: 12,
      },
    },
  })
})

export const Chip: FC<Types.ChipProps> = (props) => {
  const classes = useStyles()
  const { title, icon, handleClick, text, to } = props

  return (
    <Paper
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      component={to ? RouterLink : 'div'}
      title={title || `View more ${text} communities`}
      elevation={2}
      to={to}
      role="button"
      className={classes.chip}
      onClick={handleClick}
    >
      {icon}
      {text}
    </Paper>
  )
}

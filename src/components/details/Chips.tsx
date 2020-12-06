import React, { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Paper } from '@material-ui/core'

import * as Types from './types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    chip: {
      display: 'inline-flex',
      alignItems: 'center',
      borderRadius: 5,
      backgroundColor: theme.palette.grey[700],
      padding: '0.15em 0.45em',
      lineHeight: 1.5,
      marginBottom: '0.25em', // otherwise crowded when wrapped
      transition: '300ms backgroundColor ease',
      whiteSpace: 'nowrap',
      '&:hover': {
        backgroundColor: theme.palette.grey[800],
      },
      '& > :first-child': {
        marginRight: '0.35em',
      },
      '& > svg': {
        fontSize: '1.25em',
      },
      '& .country-flag': {
        // Ensure outer white shapes are seen
        outline: `solid 1px ${theme.palette.divider}`,
        height: 12,
      },
    },
  })
)

export const SeeRelatedChip: FC<Types.SeeRelatedChipProps> = (props) => {
  const classes = useStyles()
  const { children, to, name } = props

  return (
    <Paper
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      component={RouterLink}
      to={to}
      title={`View more ${name} communities`}
      elevation={2}
      className={classes.chip}
    >
      {children}
    </Paper>
  )
}

export const ChipWithClick: FC<Types.ChipWithClickProps> = (props) => {
  const classes = useStyles()
  const { title, icon, handleClick, text } = props

  return (
    <Paper
      title={title}
      elevation={2}
      role="button"
      className={classes.chip}
      onClick={handleClick}
    >
      {icon}
      {text}
    </Paper>
  )
}

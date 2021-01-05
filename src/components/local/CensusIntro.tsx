import React, { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

import * as Types from './types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      fontSize: ({ subtle }: Types.CensusIntroProps) => {
        return subtle ? '0.5rem' : '0.75rem'
      },
      color: ({ subtle }: Types.CensusIntroProps) => {
        return subtle ? theme.palette.text.secondary : 'inherit'
      },
      marginBottom: '0.75rem',
    },
  })
)

export const CensusIntro: FC<Types.CensusIntroProps> = (props) => {
  const { subtle } = props
  const classes = useStyles({ subtle })

  const Extree =
    'The options below are 5-year ACS estimates on “language spoken at home for the Population 5 Years and Over”, sorted by population size.'

  return (
    <Typography className={classes.root}>
      The Census Bureau’s American Community Survey (ACS) provides an indication
      of where the largest several dozen languages are distributed.{' '}
      {!subtle && Extree} <RouterLink to="/about#census">More info</RouterLink>
    </Typography>
  )
}

import React, { FC } from 'react'
import { Theme } from '@mui/material/styles'

import makeStyles from '@mui/styles/makeStyles'
import createStyles from '@mui/styles/createStyles'

import { AllLangDataToggle } from 'components/legend'
import { CensusAutoZoomToggle } from './CensusAutoZoomToggle'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'grid',
      alignItems: 'center',
      gridTemplateColumns: 'auto auto',
      gridColumnGap: 4,
      marginBottom: '0.75rem',
      paddingBottom: '0.5rem',
      borderBottom: `solid 1px ${theme.palette.divider}`,
      [theme.breakpoints.down('md')]: {
        gridColumnGap: 2,
      },
    },
  })
)

export const CensusTogglesWrap: FC = (props) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <AllLangDataToggle />
      <CensusAutoZoomToggle />
    </div>
  )
}

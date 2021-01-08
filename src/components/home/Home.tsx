import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import { GoSearch } from 'react-icons/go'

import { LegendPanel } from 'components/legend'
import { PanelContentSimple } from 'components/panels'
import { SearchByOmnibox } from './SearchByOmnibox'
import { FiltersWarning } from './FiltersWarning'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    panelMainHeading: {
      alignItems: 'center',
      display: 'flex',
      fontSize: '1.5rem',
      '& > svg': {
        fill: theme.palette.text.secondary,
        fontSize: '0.75rem',
        marginRight: '0.25rem',
      },
    },
  })
)

export const Home: FC = () => {
  const classes = useStyles()

  return (
    <PanelContentSimple>
      <Typography
        className={classes.panelMainHeading}
        variant="h4"
        component="h2"
      >
        <GoSearch />
        Search language communities
      </Typography>
      <SearchByOmnibox />
      <FiltersWarning />
      <LegendPanel />
    </PanelContentSimple>
  )
}

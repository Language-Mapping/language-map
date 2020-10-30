import React, { FC, useState } from 'react'
import { Typography, Link, Grid, Paper } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { FaGlobeAmericas } from 'react-icons/fa'

import { LayerSymbSelect, LayerLabelSelect, Legend } from 'components/legend'
import { ToggleableSection } from 'components'
import { LegendSwatch } from './types'
import { WorldRegionMap } from './WorldRegionMap'

type LegendPanelComponent = {
  legendItems: LegendSwatch[]
  groupName: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    changeLegendLink: {
      alignItems: 'center',
      display: 'inline-flex',
      fontSize: '0.8rem',
      '& svg': {
        marginRight: 4,
      },
    },
    legendCtrls: {
      margin: '0.5rem 0',
    },
    inner: {
      padding: '1rem', // TODO: consistentize w/other panels, cards, etc.
      marginTop: '1em',
    },
  })
)

export const LegendPanel: FC<LegendPanelComponent> = (props) => {
  const { legendItems, groupName } = props
  const classes = useStyles()
  const [showWorldMap, setShowWorldMap] = useState<boolean>(false)

  return (
    <Paper elevation={4} className={classes.inner}>
      <Typography variant="h6" component="h3">
        Legend
      </Typography>
      <small style={{ fontSize: 10, lineHeight: 1 }}>
        <b>@Ross:</b> all the legend items are linked to their corresponding
        routes, so I'm thinking a small blurb here indicating that since they
        don't appear very link-y (and I'm reluctant to underline/bold/colorize
        all of them). The "Size" categories aren't working though as the raw
        values are numbers mapped to strings. So, before I take the time to fix
        that, let's decide if you even want Size to be linked.
      </small>
      <Grid container className={classes.legendCtrls}>
        <Grid item xs={6}>
          <LayerSymbSelect />
        </Grid>
        <Grid item xs={6}>
          <LayerLabelSelect />
        </Grid>
      </Grid>
      <Legend legendItems={legendItems} groupName={groupName} />
      <Link
        href="#"
        className={classes.changeLegendLink}
        onClick={(e: React.MouseEvent) => {
          e.preventDefault()
          setShowWorldMap(!showWorldMap)
        }}
      >
        <FaGlobeAmericas />
        {showWorldMap ? 'Hide' : 'Show'} world map
      </Link>
      <ToggleableSection show={showWorldMap}>
        <WorldRegionMap />
      </ToggleableSection>
    </Paper>
  )
}

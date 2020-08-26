import React, { FC, useEffect, useState } from 'react'
import { Link, Grid, Typography, useMediaQuery } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { LayerSymbSelect, LayerLabelSelect, Legend } from 'components/legend'
import { ToggleableSection } from 'components'
import { LegendSwatch } from './types'

type LegendPanelComponent = {
  legendItems: LegendSwatch[]
  groupName: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mainLegendHeading: {
      display: 'inline-block',
    },
    changeLegendLink: {
      fontSize: '0.8em',
      marginLeft: 4,
      color: theme.palette.primary.main,
      [theme.breakpoints.up('sm')]: {
        display: 'none',
      },
    },
    legendCtrls: {
      marginBottom: 4,
    },
    legendCtrlsDescrip: {
      color: theme.palette.grey[600],
      fontSize: '0.7rem',
    },
  })
)

export const LegendPanel: FC<LegendPanelComponent> = (props) => {
  const { legendItems, groupName } = props
  const classes = useStyles()
  const {
    changeLegendLink,
    legendCtrls,
    legendCtrlsDescrip,
    mainLegendHeading,
  } = classes
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.only('xs'))
  const [showLegend, setShowLegend] = useState<boolean>(false)

  // Bit of a lag on desktop but the alternative of two separate components with
  // CSS-based breakpoints instead of `useMediaQuery` seemed overkill.
  useEffect((): void => setShowLegend(!isMobile), [isMobile])

  return (
    <>
      <Typography variant="h5" component="h3" className={mainLegendHeading}>
        Legend
      </Typography>
      <Link
        href="#"
        className={changeLegendLink}
        onClick={(e: React.MouseEvent) => {
          e.preventDefault()
          setShowLegend(!showLegend)
        }}
      >
        Options
      </Link>
      <ToggleableSection show={showLegend}>
        <Grid container spacing={2} className={legendCtrls}>
          <Grid item>
            <Typography className={legendCtrlsDescrip}>
              Visualize language communities in different ways by changing their
              symbols and labels below.
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <LayerSymbSelect />
          </Grid>
          <Grid item xs={6}>
            <LayerLabelSelect />
          </Grid>
        </Grid>
      </ToggleableSection>
      <Legend legendItems={legendItems} groupName={groupName} />
    </>
  )
}

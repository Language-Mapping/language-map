import React, { FC, useEffect, useState } from 'react'
import { Link, Grid, Typography, useMediaQuery } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { LayerSymbSelect, LayerLabelSelect, Legend } from 'components/legend'
import { LegendSwatch } from './types'

type LegendPanelComponent = {
  legendItems: LegendSwatch[]
  groupName: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    legendCtrls: {
      overflow: 'hidden',
      transition: '300ms all',
    },
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
    legendCtrlsDescrip: {
      color: theme.palette.grey[600],
      fontSize: '0.7rem',
    },
  })
)

export const LegendPanel: FC<LegendPanelComponent> = (props) => {
  const { legendItems, groupName } = props
  const classes = useStyles()
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.only('xs'))
  const [showLegend, setShowLegend] = useState<boolean>(!isMobile)

  useEffect((): void => {
    setShowLegend(!isMobile)
  }, [isMobile])

  return (
    <>
      <Typography
        variant="h5"
        component="h3"
        className={classes.mainLegendHeading}
      >
        Legend
      </Typography>
      <Link
        href="#"
        className={classes.changeLegendLink}
        onClick={(e: React.MouseEvent) => {
          e.preventDefault()
          setShowLegend(!showLegend)
        }}
      >
        Options
      </Link>
      <div
        className={classes.legendCtrls}
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            flex: showLegend ? 1 : 0,
            height: 'auto',
            maxHeight: showLegend ? 200 : 0,
            opacity: showLegend ? 1 : 0,
            overflow: 'hidden',
            transition: '300ms all',
          }}
        >
          <Grid container spacing={2}>
            <Grid item>
              <Typography className={classes.legendCtrlsDescrip}>
                Visualize language communities in different ways by changing
                their symbols and labels below.
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <LayerSymbSelect />
            </Grid>
            <Grid item xs={6}>
              <LayerLabelSelect />
            </Grid>
          </Grid>
        </div>
      </div>
      <Legend legendItems={legendItems} groupName={groupName} />
    </>
  )
}

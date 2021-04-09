import React, { FC, useState } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { SpeedDial, SpeedDialAction } from '@material-ui/lab'
import { MdYoutubeSearchedFor } from 'react-icons/md'
import { FiLayers } from 'react-icons/fi'
import { FaSearchPlus, FaSearchMinus } from 'react-icons/fa'

import { MapCtrlBtnsProps, CtrlBtnConfig } from './types'
import { MapOptionsMenu } from './MapOptionsMenu'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 75,
      flex: 1,
      padding: 4,
      backgroundColor: 'none',
      [theme.breakpoints.up('sm')]: {
        backgroundColor: theme.palette.primary.dark,
      },
      '& svg': {
        fontSize: '1.4em',
      },
      [theme.breakpoints.up('md')]: {
        fontSize: '1.35em',
      },
    },
    speedDialAction: {
      margin: '0 0.2rem 0.2rem',
      [theme.breakpoints.up('sm')]: {
        margin: '0.2em',
      },
      '&:hover': {
        [theme.breakpoints.down('sm')]: {
          backgroundColor: theme.palette.background.default,
        },
      },
    },
  })
)

const ctrlBtnsConfig = [
  {
    id: 'in',
    icon: <FaSearchPlus />,
    name: 'Zoom in',
  },
  {
    id: 'out',
    icon: <FaSearchMinus />,
    name: 'Zoom out',
  },
  {
    id: 'home',
    icon: <MdYoutubeSearchedFor style={{ fontSize: '1.75em' }} />,
    name: 'Reset zoom',
  },
  {
    id: 'reset-pitch',
    icon: <b>3D</b>,
    name: 'Toggle 2D/3D',
  },
] as CtrlBtnConfig[]

export const MapCtrlBtns: FC<MapCtrlBtnsProps> = (props) => {
  const { onMapCtrlClick, isMapTilted } = props
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget)
  }

  return (
    <>
      <SpeedDial
        ariaLabel="Map control buttons"
        className={classes.root}
        hidden
        open
        direction="down"
      >
        {ctrlBtnsConfig.map((action) => {
          let { icon } = action
          if (action.id === 'reset-pitch') icon = isMapTilted ? <b>2D</b> : icon

          return (
            <SpeedDialAction
              className={classes.speedDialAction}
              key={action.name}
              icon={icon}
              tooltipTitle={action.name}
              FabProps={{ size: 'small' }}
              onClick={() => {
                onMapCtrlClick(action.id)
              }}
            />
          )
        })}
        <SpeedDialAction
          className={classes.speedDialAction}
          icon={<FiLayers />}
          tooltipTitle="Show map options"
          FabProps={{ size: 'small' }}
          onClick={handleClick}
        />
      </SpeedDial>
      <MapOptionsMenu anchorEl={anchorEl} setAnchorEl={setAnchorEl} />
    </>
  )
}

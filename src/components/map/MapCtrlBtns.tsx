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
      '& svg': {
        fontSize: '1.25rem',
      },
      [theme.breakpoints.down('sm')]: {
        position: 'absolute',
        right: '0.5rem',
        top: -4, // deals w/padding on btn root
      },
      [theme.breakpoints.only('xs')]: {
        right: '0.25rem',
        top: '-0.5rem', // deals w/padding on btn root
      },
      [theme.breakpoints.up('md')]: {
        backgroundColor: theme.palette.primary.dark,
        boxShadow: '-1px 2px 8px hsl(0deg 0% 0% / 65%)',
        height: '100%',
      },
    },
    speedDialAction: {
      margin: '0 0.25rem 0.25rem',
      [theme.breakpoints.up('md')]: {
        margin: '0 0.5rem 0.5rem',
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

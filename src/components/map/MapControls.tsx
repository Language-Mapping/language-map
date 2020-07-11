import React, { FC, useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Button, ButtonGroup, Popover, Box } from '@material-ui/core'
import { FiHome, FiZoomIn, FiZoomOut, FiLayers } from 'react-icons/fi'

import { LayersMenu } from 'components/map'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mapCtrlsBtns: {
      marginTop: theme.spacing(1),
      position: 'absolute',
      top: 60,
      right: 8,
      zIndex: 1,
      '& button': {
        minWidth: 40,
        padding: `${theme.spacing(1)}px 0`,
      },
      '& svg': {
        height: '1.5em',
        width: '1.5em',
      },
    },
  })
)

export const MapControls: FC = () => {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <ButtonGroup
        orientation="vertical"
        color="primary"
        aria-label="vertical contained primary button group"
        variant="contained"
        size="small"
        className={classes.mapCtrlsBtns}
      >
        <Button>
          <FiZoomIn />
        </Button>
        <Button>
          <FiZoomOut />
        </Button>
        <Button>
          <FiHome />
        </Button>
        <Button
          aria-describedby={id}
          variant="contained"
          color="primary"
          onClick={handleClick}
        >
          <FiLayers />
        </Button>
      </ButtonGroup>
      <div>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          transformOrigin={{
            vertical: 'center',
            horizontal: 'left',
          }}
        >
          <Box padding={2} width={225}>
            <LayersMenu />
          </Box>
        </Popover>
      </div>
    </>
  )
}

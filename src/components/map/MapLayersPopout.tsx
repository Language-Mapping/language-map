// TODO: add COVID project credit and link to MIT for much of this file? Most of
// it was copied from MUI in the first place though...
import React, { FC } from 'react'
import { Fab, Popover, Box } from '@material-ui/core'
import { FiLayers } from 'react-icons/fi'

import { LayerVisibilityTypes } from 'context/types'
import { LayersMenu } from 'components/map'

export type LayerToggleType = {
  name: string
  layerId: keyof LayerVisibilityTypes
}

export const MapLayersPopout: FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div>
      <Fab
        size="small"
        aria-label="map layers"
        color="primary"
        aria-describedby="long-menu"
        onClick={handleClick}
      >
        <FiLayers />
      </Fab>
      <Popover
        id="long-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Box padding={2} width={225} height={225}>
          <LayersMenu />
        </Box>
      </Popover>
    </div>
  )
}

// TODO: add COVID project credit and link to MIT for much of this file? Most of
// it was copied from MUI in the first place though...
import React, { FC, useContext } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import {
  Fab,
  Popover,
  Box,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Switch,
  InputLabel,
  Select,
} from '@material-ui/core'
import { FiLayers } from 'react-icons/fi'

import { LayerVisibilityTypes } from 'context/types'
import { GlobalContext } from 'components'

type LayerToggleType = {
  name: string
  layerId: keyof LayerVisibilityTypes
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      width: 175,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  })
)

const LayerToggle: FC<LayerToggleType> = ({ name, layerId }) => {
  const { state, dispatch } = useContext(GlobalContext)
  const checked = state.layerVisibility[layerId]

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'TOGGLE_LAYER_VISIBILITY', payload: layerId })
  }

  return (
    <FormControlLabel
      label={name}
      control={
        <Switch
          inputProps={{ 'aria-label': 'secondary checkbox' }}
          checked={checked}
          onChange={handleChange}
          name={layerId}
        />
      }
    />
  )
}

const LayerSymbolSelect: FC = () => {
  const classes = useStyles()
  const { state, dispatch } = useContext(GlobalContext)
  const currentValue = state.activeLangSymbKey

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_LANG_SYMBOLOGY', payload: event.target.value })
  }

  // TODO: these guys?
  // FormHelperText,
  // NativeSelect,

  return (
    <FormControl className={classes.formControl}>
      <InputLabel htmlFor="lang-symb-select">Show by:</InputLabel>
      <Select
        native
        value={currentValue}
        // onChange={handleChange}
        inputProps={{
          name: 'symbology',
          id: 'lang-symb-select',
        }}
      >
        <option value="Size">Size</option>
        <option value="Status">Status</option>
        <option value="Region">Region</option>
      </Select>
    </FormControl>
  )
}

const LayerLabelSelect: FC = () => {
  const classes = useStyles()
  const { state, dispatch } = useContext(GlobalContext)
  const currentValue = state.activeLangLabelKey

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_LANG_LABELS', payload: event.target.value })
  }

  return (
    <FormControl className={classes.formControl}>
      <InputLabel htmlFor="lang-label-select">Label by:</InputLabel>
      <Select
        native
        value={currentValue}
        // onChange={handleChange}
        inputProps={{
          name: 'label',
          id: 'lang-label-select',
        }}
      >
        <option value="Neighborhood">Neighborhood</option>
        <option value="Endonym">Endonym</option>
        <option value="Glottocode">Glottocode</option>
      </Select>
    </FormControl>
  )
}

const LayersMenu: FC = () => {
  return (
    <>
      <FormControl component="fieldset">
        <FormLabel component="legend">Languages</FormLabel>
        <FormGroup>
          <LayerToggle layerId="languages" name="Show/hide" />
        </FormGroup>
        <LayerSymbolSelect />
        <ul style={{ listStyleType: 'none', padding: 5, margin: 0 }}>
          <li>● Class 1</li>
          <li>○ Class 2</li>
          <li>◌ Class 3</li>
          <li>○ Class 4</li>
        </ul>
        <LayerLabelSelect />
      </FormControl>
    </>
  )
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
        <Box padding={2}>
          <LayersMenu />
        </Box>
      </Popover>
    </div>
  )
}

import React, { FC } from 'react'
import { isMobile } from 'react-device-detect'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import { FiSun, FiMoon } from 'react-icons/fi'
import { RiEyeCloseLine } from 'react-icons/ri'

import { useMapToolsState, useMapToolsDispatch } from 'components/context'
import { useUItext, SubtleText } from 'components/generic'
import { BaseLayer } from './types'

const useStyles = makeStyles((theme: Theme) => {
  const desktopStyles = {
    '&:hover': {
      backgroundColor: theme.palette.secondary.main,
    },
  }

  return createStyles({
    root: {
      display: 'flex',
      width: '100%',
      margin: '0.5rem 0 0.65rem',
    },
    grouped: {
      flex: 1,
      textTransform: 'none',
    },
    sizeSmall: {
      padding: '4px 7px',
    },
    label: {
      display: 'grid',
      gridTemplateColumns: 'auto auto',
      gridColumnGap: 4,
    },
    buttonRoot: {
      transition: '300ms background-color',
      // Crank the specificity
      '&.MuiToggleButton-root': {
        color: theme.palette.text.primary,
      },
    },
    selected: {
      // Crank the specificity
      '&.MuiToggleButton-root': {
        backgroundColor: theme.palette.secondary.main,
        ...(!isMobile && desktopStyles),
      },
    },
  })
})

export const BaseLayerToggles: FC = (props) => {
  const { baseLayer } = useMapToolsState()
  const mapToolsDispatch = useMapToolsDispatch()
  const classes = useStyles()
  const { text: baseHelp } = useUItext('map-menu-baselayers')
  const btnClasses = {
    label: classes.label,
    sizeSmall: classes.sizeSmall,
    selected: classes.selected,
    root: classes.buttonRoot,
  }

  const handleBaselayer = (
    event: React.MouseEvent<HTMLElement>,
    newBase: BaseLayer
  ) => {
    mapToolsDispatch({ type: 'SET_BASELAYER', payload: newBase })
  }

  return (
    <>
      <ToggleButtonGroup
        value={baseLayer}
        exclusive
        onChange={handleBaselayer}
        aria-label="map baselayer"
        size="small"
        classes={{ root: classes.root, grouped: classes.grouped }}
      >
        <ToggleButton
          value="light"
          color="blue"
          aria-label="light baselayer"
          classes={btnClasses}
        >
          <FiSun /> Light
        </ToggleButton>
        <ToggleButton
          value="dark"
          aria-label="dark baselayer"
          classes={btnClasses}
        >
          <FiMoon /> Dark
        </ToggleButton>
        <ToggleButton
          value="none"
          aria-label="no baselayer"
          classes={btnClasses}
        >
          <RiEyeCloseLine /> None
        </ToggleButton>
      </ToggleButtonGroup>
      <SubtleText>{baseHelp}</SubtleText>
    </>
  )
}

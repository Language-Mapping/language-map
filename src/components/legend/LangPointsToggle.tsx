// TODO: rename file to something logical; mv it and all children to ../local
import React, { FC } from 'react'
import { FormControlLabel, Switch } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { useLabelAndSymbDispatch } from 'components/context/SymbAndLabelContext'
import { SimplePopover } from 'components/generic'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginLeft: 0,
    },
    controlLabel: {
      display: 'flex',
      alignItems: 'center',
    },
    smallerText: {
      fontSize: '0.75rem',
    },
  })
)

export const LangPointsToggle: FC<{ checked: boolean }> = (props) => {
  const { checked } = props
  const classes = useStyles()
  const { smallerText, root } = classes
  const symbLabelDispatch = useLabelAndSymbDispatch()

  const handleBoundariesToggle = () => {
    symbLabelDispatch({ type: 'TOGGLE_LANG_POINTS' })
  }

  const ControlLabel = (
    <div className={classes.controlLabel}>
      Hide language points and icons
      <SimplePopover
        text={
          <>
            Turn this on to hide the language points symbols or icons. This can
            be useful if you only want to see their labels.
          </>
        }
      />
    </div>
  )

  return (
    <FormControlLabel
      classes={{ label: smallerText, root }}
      control={
        <Switch
          checked={checked}
          onChange={handleBoundariesToggle}
          name="toggle-lang-points"
          size="small"
        />
      }
      label={ControlLabel}
    />
  )
}

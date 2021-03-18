// TODO: rename file to something logical; mv it and all children to ../local
import React, { FC } from 'react'
import { FormControlLabel, Switch } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { useLabelAndSymbDispatch } from 'components/context/SymbAndLabelContext'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginLeft: 0,
      marginBottom: '0.25rem',
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

// TODO: abstract and reuse for labels
export const LangPointsToggle: FC<{ checked: boolean }> = (props) => {
  const { checked } = props
  const classes = useStyles()
  const { smallerText, root } = classes
  const symbLabelDispatch = useLabelAndSymbDispatch()

  const handleBoundariesToggle = () => {
    symbLabelDispatch({ type: 'TOGGLE_LANG_POINTS' })
  }

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
      label="Hide symbols"
    />
  )
}

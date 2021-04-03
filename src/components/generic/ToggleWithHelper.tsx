import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { FormControlLabel, Switch } from '@material-ui/core'

import { ToggleWithHelperProps } from './types'
import { SubtleText } from './SubtleText'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: '0 0 0.5rem',
    },
    label: {
      fontSize: '0.85rem',
    },
  })
)

export const ToggleWithHelper: FC<ToggleWithHelperProps> = (props) => {
  const { helperText, label, handleChange, checked } = props
  const classes = useStyles()

  const ControlLabel = (
    <div>
      <div className={classes.label}>{label}</div>
      {helperText && <SubtleText>{helperText}</SubtleText>}
    </div>
  )

  return (
    <FormControlLabel
      classes={{ root: classes.root }}
      control={
        <Switch
          checked={checked}
          onChange={handleChange}
          name={label}
          size="small"
        />
      }
      label={ControlLabel}
    />
  )
}

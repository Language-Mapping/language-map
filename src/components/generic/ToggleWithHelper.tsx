import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { FormControlLabel, Switch } from '@material-ui/core'

import { ToggleWithHelperProps } from './types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    switchFormCtrlRoot: {
      margin: '0 0 0.5rem',
    },
    label: {
      fontSize: '0.85rem',
    },
    helper: {
      fontSize: '0.65rem',
      color: theme.palette.text.secondary,
    },
  })
)

export const ToggleWithHelper: FC<ToggleWithHelperProps> = (props) => {
  const { helperText, label, handleChange, checked } = props
  const classes = useStyles()

  const ControlLabel = (
    <div>
      <div className={classes.label}>{label}</div>
      {helperText && <div className={classes.helper}>{helperText}</div>}
    </div>
  )

  return (
    <FormControlLabel
      classes={{ root: classes.switchFormCtrlRoot }}
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

import React, { FC } from 'react'
import { Theme } from '@mui/material/styles'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import { FormControlLabel, Switch } from '@mui/material'

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

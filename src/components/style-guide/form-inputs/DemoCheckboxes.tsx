import React, { FC, useState } from 'react'
import withStyles from '@mui/styles/withStyles'
import { green } from '@mui/material/colors'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox, { CheckboxProps } from '@mui/material/Checkbox'
import {
  MdCheckBox,
  MdFavorite,
  MdFavoriteBorder,
  MdCheckBoxOutlineBlank,
} from 'react-icons/md'

const GreenCheckbox = withStyles({
  root: {
    color: green[400],
    '&$checked': {
      color: green[600],
    },
  },
  checked: {},
})((props: CheckboxProps) => <Checkbox color="default" {...props} />)

export const DemoCheckboxes: FC = () => {
  const [state, setState] = useState({
    checkedA: true,
    checkedB: true,
    checkedF: true,
    checkedG: true,
  })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [event.target.name]: event.target.checked })
  }

  return (
    <FormGroup row>
      <FormControlLabel
        control={
          <Checkbox
            checked={state.checkedA}
            onChange={handleChange}
            name="checkedA"
          />
        }
        label="Secondary"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={state.checkedB}
            onChange={handleChange}
            name="checkedB"
            color="primary"
          />
        }
        label="Primary"
      />
      <FormControlLabel
        control={<Checkbox name="checkedC" />}
        label="Uncontrolled"
      />
      <FormControlLabel
        disabled
        control={<Checkbox name="checkedD" />}
        label="Disabled"
      />
      <FormControlLabel
        disabled
        control={<Checkbox checked name="checkedE" />}
        label="Disabled"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={state.checkedF}
            onChange={handleChange}
            name="checkedF"
            indeterminate
          />
        }
        label="Indeterminate"
      />
      <FormControlLabel
        control={
          <GreenCheckbox
            checked={state.checkedG}
            onChange={handleChange}
            name="checkedG"
          />
        }
        label="Custom color"
      />
      <FormControlLabel
        control={
          <Checkbox
            icon={<MdFavoriteBorder />}
            checkedIcon={<MdFavorite />}
            name="checkedH"
          />
        }
        label="Custom icon"
      />
      <FormControlLabel
        control={
          <Checkbox
            icon={<MdCheckBoxOutlineBlank fontSize="small" />}
            checkedIcon={<MdCheckBox fontSize="small" />}
            name="checkedI"
          />
        }
        label="Custom size"
      />
    </FormGroup>
  )
}

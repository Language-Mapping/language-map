import React, { FC } from 'react'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'

export const DemoRadios: FC = () => {
  const [value, setValue] = React.useState('female')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value)
  }

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">Options</FormLabel>
      <RadioGroup
        aria-label="pick one"
        name="pick1"
        value={value}
        onChange={handleChange}
      >
        <FormControlLabel value="1" control={<Radio />} label="Option 1" />
        <FormControlLabel value="2" control={<Radio />} label="Option 2" />
        <FormControlLabel value="3" control={<Radio />} label="Option 3" />
        <FormControlLabel
          value="disabled"
          disabled
          control={<Radio />}
          label="(Disabled option)"
        />
      </RadioGroup>
    </FormControl>
  )
}

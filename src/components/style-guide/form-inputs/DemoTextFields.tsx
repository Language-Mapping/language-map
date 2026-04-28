import React, { FC, useState } from 'react'
import { Theme } from '@mui/material/styles'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import FilledInput from '@mui/material/FilledInput'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
  })
)

export const DemoTextFields: FC = () => {
  const [name, setName] = useState('Composed TextField')
  const classes = useStyles()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <FormControl>
        <InputLabel htmlFor="component-simple">Name</InputLabel>
        <Input id="component-simple" value={name} onChange={handleChange} />
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="component-helper">Name</InputLabel>
        <Input
          id="component-helper"
          value={name}
          onChange={handleChange}
          aria-describedby="component-helper-text"
        />
        <FormHelperText id="component-helper-text">
          Some important helper text
        </FormHelperText>
      </FormControl>
      <FormControl disabled>
        <InputLabel htmlFor="component-disabled">Name</InputLabel>
        <Input id="component-disabled" value={name} onChange={handleChange} />
        <FormHelperText>Disabled</FormHelperText>
      </FormControl>
      <FormControl error>
        <InputLabel htmlFor="component-error">Name</InputLabel>
        <Input
          id="component-error"
          value={name}
          onChange={handleChange}
          aria-describedby="component-error-text"
        />
        <FormHelperText id="component-error-text">Error</FormHelperText>
      </FormControl>
      <FormControl variant="outlined">
        <InputLabel htmlFor="component-outlined">Name</InputLabel>
        <OutlinedInput
          id="component-outlined"
          value={name}
          onChange={handleChange}
          label="Name"
        />
      </FormControl>
      <FormControl variant="filled">
        <InputLabel htmlFor="component-filled">Name</InputLabel>
        <FilledInput
          id="component-filled"
          value={name}
          onChange={handleChange}
        />
      </FormControl>
    </form>
  )
}

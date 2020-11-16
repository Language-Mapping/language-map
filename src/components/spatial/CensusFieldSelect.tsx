import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { FormHelperText, FormControl, NativeSelect } from '@material-ui/core'

import { useMapToolsState, useMapToolsDispatch } from 'components/context'
import * as config from './config'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
  })
)

export const CensusFieldSelect: FC = () => {
  const classes = useStyles()
  const { censusField } = useMapToolsState()
  const mapToolsDispatch = useMapToolsDispatch()

  const handleChange = (event: React.ChangeEvent<{ value: string }>) => {
    mapToolsDispatch({
      type: 'SET_CENSUS_FIELD',
      payload: event.target.value,
    })
  }

  return (
    <div className={classes.root}>
      <FormControl className={classes.formControl}>
        {/* <InputLabel htmlFor="age-native-helper">Show by</InputLabel> */}
        <NativeSelect
          value={censusField}
          onChange={handleChange}
          // inputProps={{ name: 'field', id: 'field-native-helper' }}
        >
          <option aria-label="None" value="" selected />
          {config.censusLangFields.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </NativeSelect>
        <FormHelperText>What about PUMA?</FormHelperText>
      </FormControl>
    </div>
  )
}

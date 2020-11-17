import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import {
  InputLabel,
  FormHelperText,
  FormControl,
  NativeSelect,
} from '@material-ui/core'

import { useMapToolsState, useMapToolsDispatch } from 'components/context'
import { InterpRateOfChange } from 'components/map/types'
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
  const { censusField, censusRateOfChange } = useMapToolsState()
  const mapToolsDispatch = useMapToolsDispatch()

  const handleChange = (event: React.ChangeEvent<{ value: string }>) => {
    mapToolsDispatch({
      type: 'SET_CENSUS_FIELD',
      payload: event.target.value,
    })
  }

  const handleRocChange = (event: React.ChangeEvent<{ value: string }>) => {
    mapToolsDispatch({
      type: 'SET_CENSUS_RATE_OF_CHANGE',
      payload: event.target.value as InterpRateOfChange,
    })
  }

  const ChangeField = (
    <FormControl className={classes.formControl}>
      <InputLabel htmlFor="census-field-helper">Show by</InputLabel>
      <NativeSelect
        value={censusField}
        onChange={handleChange}
        inputProps={{ name: 'field', id: 'census-field-helper' }}
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
  )

  const ChangeRate = (
    <FormControl className={classes.formControl}>
      <InputLabel htmlFor="census-roc-helper">Rate of change</InputLabel>
      <NativeSelect
        value={censusRateOfChange}
        onChange={handleRocChange}
        inputProps={{ name: 'field', id: 'census-roc-helper' }}
      >
        {config.ratesOfChange.map((item) => (
          <option
            key={item}
            value={item}
            selected={item === censusRateOfChange}
          >
            {item}
          </option>
        ))}
      </NativeSelect>
      <FormHelperText>Different classifications, etc.</FormHelperText>
    </FormControl>
  )

  return (
    <div className={classes.root}>
      {ChangeField}
      {ChangeRate}
    </div>
  )
}

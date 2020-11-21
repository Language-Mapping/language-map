import React, { FC, useEffect } from 'react'
import { useQuery, queryCache } from 'react-query'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import {
  InputLabel,
  ListSubheader,
  FormHelperText,
  FormControl,
  Select,
  MenuItem,
} from '@material-ui/core'

import { useMapToolsState, useMapToolsDispatch } from 'components/context'
import { asyncAwaitFetch } from 'components/map/utils'
import * as config from './config'

// TODO: reuse, move into types.ts
export type CensusStateKey = 'censusField' | 'pumaField'
export type CensusFieldSelectProps = { stateKey: CensusStateKey }
export type GenericUseQuery = {
  data: {
    vector_layers: { fields: string[] }[]
  }
  isFetching: boolean
  error: Error
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
  })
)

export const CensusFieldSelect: FC<CensusFieldSelectProps> = (props) => {
  const { stateKey } = props
  const classes = useStyles()
  const field = useMapToolsState()[stateKey]
  const mapToolsDispatch = useMapToolsDispatch()
  // TODO: adapt to support tract-level, and TS the query IDs
  const {
    data: tractData,
    isFetching: isTractFetching,
    error: isTractError,
  } = useQuery('tracts') as GenericUseQuery
  const {
    data: pumaData,
    isFetching: isPumaFetching,
    error: isPumaError,
  } = useQuery('puma') as GenericUseQuery

  useEffect(() => {
    queryCache.prefetchQuery('tracts', () =>
      asyncAwaitFetch(config.endpoints.tracts)
    )
    queryCache.prefetchQuery('puma', () =>
      asyncAwaitFetch(config.endpoints.puma)
    )
  }, [])

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    // TODO: adapt
    mapToolsDispatch({
      type: 'SET_PUMA_FIELD',
      payload: event.target.value as string,
    })
  }

  if (isTractFetching || isPumaFetching) return <h2>Getting census data...</h2>
  if (isTractError || isPumaError)
    return <h2>Something went wrong fetching census data.</h2>

  const allPumaFields = pumaData.vector_layers[0].fields
  const allTractFields = tractData.vector_layers[0].fields
  const pumaFields = Object.keys(allPumaFields).map((key) => key)
  const tractFields = Object.keys(allTractFields).map((key) => key)

  const ChangeField = (
    <FormControl className={classes.formControl} fullWidth>
      <InputLabel htmlFor={`${stateKey}-field-helper`}>Show by</InputLabel>
      <Select
        labelId="census-select-label"
        id="census-select"
        defaultValue="" // TODO: fix dev errors, still not right?
        value={field}
        onChange={handleChange}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        <ListSubheader>Tracts</ListSubheader>
        {tractFields
          .filter((item) => !config.censusFieldsDropdownOmit.includes(item))
          .map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        {/* eslint-disable-next-line jsx-a11y/accessible-emoji */}
        <ListSubheader>PUMA 🐈</ListSubheader>
        {pumaFields
          .filter((item) => !config.censusFieldsDropdownOmit.includes(item))
          .map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
      </Select>
      <FormHelperText>
        Heads up: will be mutually exlusive w/Neighbs
      </FormHelperText>
    </FormControl>
  )

  return <div className={classes.root}>{ChangeField}</div>
}

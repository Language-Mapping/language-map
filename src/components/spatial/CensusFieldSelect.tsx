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
import { LocationSearchContent } from 'components/map'
import { SimplePopover } from 'components/generic'
import { asyncAwaitFetch } from 'components/map/utils'
import { censusFieldsDropdownOmit, endpoints } from './config'
import * as Types from './types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    helperText: {
      display: 'flex',
      alignItems: 'center',
    },
  })
)

export const CensusFieldSelect: FC<Types.CensusFieldSelectProps> = (props) => {
  const { stateKey } = props
  const classes = useStyles()
  // TODO: `censusField` 24/7, no need for stateKey here?
  const field = useMapToolsState()[stateKey]
  const mapToolsDispatch = useMapToolsDispatch()
  // TODO: adapt to support tract-level, and TS the query IDs
  const {
    data: tractData,
    isFetching: isTractFetching,
    error: isTractError,
  } = useQuery('tracts' as Types.CensusQueryID) as Types.GenericUseQuery
  const {
    data: pumaData,
    isFetching: isPumaFetching,
    error: isPumaError,
  } = useQuery('puma' as Types.CensusQueryID) as Types.GenericUseQuery

  useEffect(() => {
    queryCache.prefetchQuery('tracts' as Types.CensusQueryID, () =>
      asyncAwaitFetch(endpoints.tracts)
    )
    queryCache.prefetchQuery('puma' as Types.CensusQueryID, () =>
      asyncAwaitFetch(endpoints.puma)
    )
  }, [])

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const censusType: Types.CensusQueryID = event.currentTarget.ariaLabel

    // TODO: consider a 'CLEAR_CENSUS_*****' action
    if (censusType === 'puma') {
      mapToolsDispatch({
        type: 'SET_PUMA_FIELD',
        payload: event.target.value as string,
      })
      // FRAGILE: (if ever more than just these two): clear the other
      mapToolsDispatch({ type: 'SET_CENSUS_FIELD', payload: '' })
    } else if (censusType === 'tracts') {
      mapToolsDispatch({
        type: 'SET_CENSUS_FIELD',
        payload: event.target.value as string,
      })
      // FRAGILE: (if ever more than just these two): clear the other
      mapToolsDispatch({ type: 'SET_PUMA_FIELD', payload: '' })
    }
  }

  if (isTractFetching || isPumaFetching) return <h2>Getting census data...</h2>
  if (isTractError || isPumaError)
    return <h2>Something went wrong fetching census data.</h2>

  const allPumaFields = pumaData.vector_layers[0].fields
  const allTractFields = tractData.vector_layers[0].fields
  const pumaFields = Object.keys(allPumaFields).map((key) => key)
  const tractFields = Object.keys(allTractFields).map((key) => key)

  // // @ts-ignore
  // const handleSelectChange = (index, fieldType) => (e) => {}
  const extree =
    'For best results, use together with ELA data [DATA]. ELA is not responsible for Census data or categories. More info here [ABOUT].'

  const ChangeField = (
    <LocationSearchContent
      heading="Census data (NYC only)"
      explanation="The Census Bureau’s American Community Survey (ACS), while recording far fewer languages than ELA, provides a useful indication of where the largest several dozen languages are distributed. Find below 5-year ACS estimates on “language spoken at home for the Population 5 Years and Over”."
    >
      <FormControl className={classes.formControl} fullWidth>
        <InputLabel htmlFor={`${stateKey}-field-helper`}>
          Choose a language
        </InputLabel>
        <Select
          labelId="census-select-label"
          id="census-select"
          defaultValue="" // TODO: fix dev errors, still not right?
          value={field}
          onChange={handleChange}
          // onChange={handleSelectChange(idx, 'age')}
          // inputProps={{}}
        >
          <MenuItem value="">
            <em>None (hide census layer)</em>
          </MenuItem>
          <ListSubheader>Tract-level</ListSubheader>
          {tractFields
            .filter((item) => !censusFieldsDropdownOmit.includes(item))
            .map((item) => (
              <MenuItem key={item} value={item} aria-label="tracts">
                {item}
              </MenuItem>
            ))}
          {/* eslint-disable-next-line jsx-a11y/accessible-emoji */}
          <ListSubheader>PUMA-level</ListSubheader>
          {pumaFields
            .filter((item) => !censusFieldsDropdownOmit.includes(item))
            .map((item) => (
              <MenuItem key={item} value={item} aria-label="puma">
                {item}
              </MenuItem>
            ))}
        </Select>
        <FormHelperText className={classes.helperText}>
          Tract level if available, otherwise less-granular PUMA level
          <SimplePopover text={extree} />
        </FormHelperText>
      </FormControl>
    </LocationSearchContent>
  )

  return <div className={classes.root}>{ChangeField}</div>
}

import React, { FC, useEffect } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useQuery, queryCache } from 'react-query'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { FormHelperText, TextField } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'

import { useMapToolsDispatch } from 'components/context'
import { LocationSearchContent } from 'components/map'
import { asyncAwaitFetch } from 'components/map/utils'

import * as config from './config'
import * as utils from './utils'
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
    // TODO: small-font gray text is in high demand, so make it a component.
    subtleText: {
      color: theme.palette.text.secondary,
      fontSize: '0.7em',
    },
  })
)

export const CensusFieldSelect: FC = () => {
  const classes = useStyles()
  const mapToolsDispatch = useMapToolsDispatch()
  // TODO: adapt to support tract-level, and TS the query IDs
  const {
    data: tractData,
    isFetching: isTractFetching,
    error: isTractError,
  } = useQuery('tracts' as Types.CensusQueryID) as Types.SheetsQuery
  const {
    data: pumaData,
    isFetching: isPumaFetching,
    error: isPumaError,
  } = useQuery('puma' as Types.CensusQueryID) as Types.SheetsQuery

  useEffect(() => {
    queryCache.prefetchQuery('tracts' as Types.CensusQueryID, () =>
      asyncAwaitFetch(config.endpoints.tracts)
    )
    queryCache.prefetchQuery('puma' as Types.CensusQueryID, () =>
      asyncAwaitFetch(config.endpoints.puma)
    )
  }, [])

  const handleChange = (value: Types.PreppedCensusRow | null) => {
    // TODO: consider a 'CLEAR_CENSUS_*****' action
    if (!value) {
      mapToolsDispatch({ type: 'SET_CENSUS_FIELD', payload: '' })
      mapToolsDispatch({ type: 'SET_PUMA_FIELD', payload: '' })

      return
    }

    const lowerCase = value.groupTitle.toLowerCase()

    // Clear the one not in question (FRAGILE, if ever more than just these two)
    if (lowerCase.includes('puma')) {
      mapToolsDispatch({ type: 'SET_PUMA_FIELD', payload: value.pretty })
      mapToolsDispatch({ type: 'SET_CENSUS_FIELD', payload: '' })
    } else if (lowerCase.includes('tracts')) {
      mapToolsDispatch({ type: 'SET_CENSUS_FIELD', payload: value.pretty })
      mapToolsDispatch({ type: 'SET_PUMA_FIELD', payload: '' })
    }
  }

  if (isTractFetching || isPumaFetching) return <h2>Getting census data...</h2>
  if (isTractError || isPumaError)
    return <h2>Something went wrong fetching census data.</h2>

  const pumaFields = utils
    .prepCensusFields(pumaData, 'Public Use Microdata Areas (PUMAs)')
    .sort(utils.sortBySort)
  const tractFields = utils
    .prepCensusFields(tractData, 'Census Tracts')
    .sort(utils.sortBySort)

  const Explanation = (
    <>
      The Census Bureau’s American Community Survey (ACS), while recording far
      fewer languages than ELA, provides a useful indication of where the
      largest several dozen languages are distributed. Find below 5-year ACS
      estimates on “language spoken at home for the Population 5 Years and
      Over”, in descending order by population size.{' '}
      <RouterLink to="/about#census">More info</RouterLink>
    </>
  )

  const ChangeField = (
    <LocationSearchContent
      heading="Census (NYC only)"
      explanation={Explanation}
    >
      <Autocomplete
        id="census-autocomplete"
        options={[...tractFields, ...pumaFields]}
        getOptionLabel={({ pretty }) => pretty}
        groupBy={({ groupTitle }) => groupTitle}
        fullWidth
        className={classes.formControl}
        onChange={(event, value) => handleChange(value)}
        size="small"
        renderInput={(params) => {
          return (
            <TextField
              {...params}
              label="Choose a language"
              variant="outlined"
            />
          )
        }}
      />
      <FormHelperText className={classes.helperText}>
        Tract level if available, otherwise less-granular PUMA level
      </FormHelperText>
    </LocationSearchContent>
  )

  return <div className={classes.root}>{ChangeField}</div>
}

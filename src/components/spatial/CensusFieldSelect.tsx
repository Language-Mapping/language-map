import React, { FC, useEffect } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useQuery, queryCache } from 'react-query'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { TextField, Typography, ListSubheader } from '@material-ui/core'
import Autocomplete, {
  AutocompleteRenderGroupParams,
} from '@material-ui/lab/Autocomplete'

import { useMapToolsDispatch } from 'components/context'
import { LocationSearchContent } from 'components/map'
import { asyncAwaitFetch } from 'components/map/utils'
import { SubtleText } from 'components/generic'

import * as config from './config'
import * as utils from './utils'
import * as Types from './types'

type GroupHeaderProps = {
  title: string
  subTitle: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    intro: {
      fontSize: '1.1em',
      marginBottom: '1.25em',
    },
    listbox: {
      paddingTop: 0,
      [theme.breakpoints.down('sm')]: {
        maxHeight: 225, // maybe helps prevent unwanted upward-opening menu?
      },
    },
    groupHeader: {
      backgroundColor: theme.palette.primary.main,
      borderTopLeftRadius: 4,
      borderTopRightRadius: 4,
      boxShadow: '0 2px 7px hsla(0, 0%, 0%, 0.15)',
      lineHeight: 1,
      paddingTop: '0.25em',
      paddingBottom: '0.25em',
    },
    groupTitle: {
      color: theme.palette.text.primary,
      lineHeight: 1.4,
    },
    groupSubTitle: {
      fontSize: '0.65em',
    },
    // Individual list items
    option: {
      fontSize: '0.75em',
      minHeight: 32,
    },
  })
)

const GroupHeader: FC<GroupHeaderProps> = (props) => {
  const { title, subTitle } = props
  const classes = useStyles()

  return (
    <ListSubheader className={classes.groupHeader}>
      <Typography className={classes.groupTitle} variant="h6">
        {title}
      </Typography>
      <Typography className={classes.groupSubTitle}>{subTitle}</Typography>
    </ListSubheader>
  )
}

const renderGroup = (params: AutocompleteRenderGroupParams) => {
  const split = params.group.split('|||')

  return [
    <GroupHeader key={params.key} title={split[0]} subTitle={split[1]} />,
    params.children,
  ]
}

const Intro: FC = () => {
  const classes = useStyles()

  return (
    <Typography className={classes.intro}>
      The Census Bureau’s American Community Survey provides an indication of
      where the largest several dozen languages are distributed. The options
      below are 5-year ACS estimates on “language spoken at home for the
      Population 5 Years and Over”, sorted by population size.{' '}
      <RouterLink to="/about#census">More info</RouterLink>
    </Typography>
  )
}

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
      asyncAwaitFetch(config.configEndpoints.tracts)
    )
    queryCache.prefetchQuery('puma' as Types.CensusQueryID, () =>
      asyncAwaitFetch(config.configEndpoints.puma)
    )
  }, [])

  const handleChange = (value: Types.PreppedCensusLUTrow | null) => {
    // TODO: consider a 'CLEAR_CENSUS_*****' action
    if (!value) {
      mapToolsDispatch({ type: 'SET_CENSUS_FIELD', payload: '' })
      mapToolsDispatch({ type: 'SET_PUMA_FIELD', payload: '' })

      return
    }

    const lowerCase = value.groupTitle.toLowerCase()

    // Clear the one not in question (FRAGILE, if ever more than just these two)
    if (lowerCase.includes('puma')) {
      mapToolsDispatch({ type: 'SET_PUMA_FIELD', payload: value.id })
      mapToolsDispatch({ type: 'SET_CENSUS_FIELD', payload: '' })
    } else if (lowerCase.includes('tracts')) {
      mapToolsDispatch({ type: 'SET_CENSUS_FIELD', payload: value.id })
      mapToolsDispatch({ type: 'SET_PUMA_FIELD', payload: '' })
    }
  }

  if (isTractFetching || isPumaFetching) return <h2>Getting census data...</h2>
  if (isTractError || isPumaError)
    return <h2>Something went wrong fetching census data.</h2>

  const tractFields = utils
    .prepCensusFields(
      tractData,
      'Census Tracts|||Tracts are the smallest census unit at which language data is provided and will be used here whenever available.'
    )
    .sort(utils.sortBySort)

  const pumaFields = utils
    .prepCensusFields(
      pumaData,
      'Public Use Microdata Areas (PUMAs)|||Larger than tracts, PUMAs are a less granular census unit used here whenever tract-level is unavailable.'
    )
    .sort(utils.sortBySort)

  return (
    <LocationSearchContent
      heading="Census Language Data (NYC only)"
      explanation={<Intro />}
    >
      <Autocomplete
        id="census-autocomplete"
        classes={{ option: classes.option, listbox: classes.listbox }}
        options={[...tractFields, ...pumaFields]}
        getOptionLabel={({ pretty }) => pretty}
        groupBy={({ groupTitle }) => groupTitle}
        renderGroup={renderGroup}
        blurOnSelect="touch"
        selectOnFocus={false}
        // open // much more effective than `debug`
        fullWidth
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore // it actually DOES exist on currentTarget
        onOpen={(e) => e.currentTarget.scrollIntoView()}
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
      <SubtleText>
        *Census Bureau category, component languages unclear
      </SubtleText>
    </LocationSearchContent>
  )
}

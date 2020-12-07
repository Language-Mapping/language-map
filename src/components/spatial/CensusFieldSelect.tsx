import React, { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { TextField, Typography, ListSubheader } from '@material-ui/core'
import Autocomplete, {
  AutocompleteRenderGroupParams,
} from '@material-ui/lab/Autocomplete'

import { useMapToolsDispatch, useMapToolsState } from 'components/context'
import { LocationSearchContent } from 'components/map'
import { SubtleText } from 'components/generic'
import { useCensusData } from './hooks'

import * as Types from './types'
import { setCensusField } from './utils'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    intro: {
      fontSize: '0.75rem',
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

const GroupHeader: FC<Types.GroupHeaderProps> = (props) => {
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

export const CensusIntro: FC<{ concise?: boolean }> = (props) => {
  const { concise } = props
  const classes = useStyles()

  const Extree =
    'The options below are 5-year ACS estimates on “language spoken at home for the Population 5 Years and Over”, sorted by population size.'

  return (
    <Typography className={classes.intro}>
      The Census Bureau’s American Community Survey (ACS) provides an indication
      of where the largest several dozen languages are distributed.{' '}
      {!concise && Extree} <RouterLink to="/about#census">More info</RouterLink>
    </Typography>
  )
}

const CensusAutocomplete: FC<Types.CensusSelectProps> = (props) => {
  const { tracts, puma } = props
  const classes = useStyles()
  const mapToolsDispatch = useMapToolsDispatch()

  const handleChange = (value: Types.PreppedCensusLUTrow | null) => {
    setCensusField(value, mapToolsDispatch)
  }

  return (
    <>
      <Autocomplete
        id="census-autocomplete"
        classes={{ option: classes.option, listbox: classes.listbox }}
        options={[...tracts, ...puma]}
        getOptionLabel={({ pretty }) => pretty}
        groupBy={({ groupTitle }) => groupTitle}
        renderGroup={renderGroup}
        blurOnSelect="touch"
        selectOnFocus={false}
        fullWidth
        // open // much more effective than `debug`
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore // it actually DOES exist on currentTarget
        onOpen={(e) => e.currentTarget.scrollIntoView()}
        onChange={(event, value) => handleChange(value)}
        size="small"
        renderInput={(params) => (
          <TextField {...params} label="Choose a language" variant="outlined" />
        )}
      />
      <SubtleText>
        *Census Bureau category, component languages unclear
      </SubtleText>
    </>
  )
}

export const CensusFieldSelect: FC = () => {
  const {
    puma: pumaFields,
    tracts: tractsFields,
  } = useMapToolsState().censusDropDownFields

  const { error: pumaError } = useCensusData('puma', pumaFields.length)
  const { error: tractsError } = useCensusData('tracts', tractsFields.length)

  if (tractsError || pumaError)
    return <p>Something went wrong fetching census data.</p>

  return (
    <LocationSearchContent
      heading="Census Language Data (NYC only)"
      explanation={<CensusIntro />}
    >
      {!tractsFields.length ||
        (!pumaFields.length && <p>Getting census data...</p>) || (
          <CensusAutocomplete tracts={tractsFields} puma={pumaFields} />
        )}
    </LocationSearchContent>
  )
}

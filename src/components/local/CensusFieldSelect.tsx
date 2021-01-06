import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { TextField, Typography, ListSubheader } from '@material-ui/core'
import Autocomplete, {
  AutocompleteRenderGroupParams,
} from '@material-ui/lab/Autocomplete'

import { useMapToolsDispatch, useMapToolsState } from 'components/context'
import { LocationSearchContent } from 'components/map'
import { SubtleText } from 'components/generic'
import { useCensusData } from './hooks'
import { CensusIntro } from './CensusIntro'

import * as Types from './types'
import { setCensusField } from './utils'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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

const CensusAutocomplete: FC<Types.CensusSelectProps> = (props) => {
  const { tracts, puma } = props
  const classes = useStyles()
  const mapToolsDispatch = useMapToolsDispatch()
  const { censusActiveFields } = useMapToolsState()
  const { puma: pumaField, tracts: tractsField } = censusActiveFields

  const defaultValue =
    [...tracts, ...puma].find(
      ({ original }) => original === pumaField || original === tractsField
    ) || null

  const handleChange = (value: Types.PreppedCensusLUTrow | null) => {
    setCensusField(value, mapToolsDispatch)
  }

  return (
    <Autocomplete
      id="census-autocomplete"
      classes={{ option: classes.option, listbox: classes.listbox }}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore // it actually DOES exist on currentTarget
      onOpen={(e) => e.currentTarget.scrollIntoView()}
      blurOnSelect="touch"
      fullWidth
      getOptionLabel={({ pretty }) => pretty}
      groupBy={({ groupTitle }) => groupTitle}
      onChange={(event, value) => handleChange(value)}
      options={[...tracts, ...puma]}
      renderGroup={renderGroup}
      selectOnFocus={false}
      size="small"
      value={defaultValue}
      // open // much more effective than `debug`
      renderInput={(params) => (
        <TextField {...params} label="Choose a language" variant="standard" />
      )}
    />
  )
}

export const CensusFieldSelect: FC = () => {
  const { censusDropDownFields } = useMapToolsState()
  const { puma: pumaFields, tracts: tractsFields } = censusDropDownFields

  // TODO: use state directly from the hook if can find a way to make it persist
  // between route changes
  const { error: pumaError } = useCensusData('puma', pumaFields)
  const { error: tractsError } = useCensusData('tracts', tractsFields)

  if (tractsError || pumaError)
    return <p>Something went wrong fetching census data.</p>

  const ready = tractsFields.length !== 0 && pumaFields.length !== 0

  return (
    <LocationSearchContent
      heading="Census Language Data (NYC only)"
      explanation={<CensusIntro />}
    >
      {!ready && <p>Getting census data...</p>}
      <>
        <CensusAutocomplete tracts={tractsFields} puma={pumaFields} />
        <SubtleText>
          *Census Bureau category, component languages unclear
        </SubtleText>
      </>
    </LocationSearchContent>
  )
}

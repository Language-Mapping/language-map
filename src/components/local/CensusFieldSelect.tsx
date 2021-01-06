import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { TextField, Typography, ListSubheader } from '@material-ui/core'
import Autocomplete, {
  AutocompleteRenderGroupParams,
} from '@material-ui/lab/Autocomplete'

import { useMapToolsDispatch, useMapToolsState } from 'components/context'
import { LocationSearchContent } from 'components/map'
import { SubtleText } from 'components/generic'
import { useCensusFields } from './hooks'
import { CensusIntro } from './CensusIntro'

import * as Types from './types'
import { setCensusField } from './utils'
import { censusGroupHeadings } from './config'

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

const CensusGroupHeader: FC<Types.GroupHeaderProps> = (props) => {
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
  const groupConfig = censusGroupHeadings[params.group as Types.CensusScope]
  const { title, subTitle } = groupConfig

  return [
    <CensusGroupHeader key={params.key} title={title} subTitle={subTitle} />,
    params.children,
  ]
}

const CensusAutocomplete: FC = (props) => {
  const classes = useStyles()
  const mapToolsDispatch = useMapToolsDispatch()
  const { censusActiveField } = useMapToolsState()
  const { data, isLoading, error } = useCensusFields()

  const defaultValue =
    data.find(({ id }) => id === censusActiveField?.id) || null

  const handleChange = (value: Types.UseCensusResponse | null) => {
    setCensusField(value, mapToolsDispatch)
  }

  if (error) return <p>Something went wrong fetching census config.</p>

  return (
    <Autocomplete
      id="census-autocomplete"
      classes={{ option: classes.option, listbox: classes.listbox }}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore // it actually DOES exist on currentTarget
      onOpen={(e) => e.currentTarget.scrollIntoView()}
      blurOnSelect="touch"
      fullWidth
      getOptionLabel={({ pretty, complicated }) =>
        `${pretty}${complicated ? '*' : ''}`
      }
      groupBy={({ scope }) => scope}
      loading={isLoading}
      loadingText="Getting census data..."
      onChange={(event, value) => handleChange(value)}
      options={data}
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
  return (
    <LocationSearchContent
      heading="Census Language Data (NYC only)"
      explanation={<CensusIntro />}
    >
      <CensusAutocomplete />
      <SubtleText>
        *Census Bureau category, component languages unclear
      </SubtleText>
    </LocationSearchContent>
  )
}

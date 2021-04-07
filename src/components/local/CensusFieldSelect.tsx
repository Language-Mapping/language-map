import React, { FC } from 'react'
import { useHistory } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { TextField, Typography, ListSubheader } from '@material-ui/core'
import Autocomplete, {
  AutocompleteRenderGroupParams,
} from '@material-ui/lab/Autocomplete'

import { useMapToolsDispatch, useMapToolsState } from 'components/context'
import { UItextFromAirtable, useUItext } from 'components/generic'
import { routes } from 'components/config/api'
import { UItextTableID } from 'components/generic/types'
import { GroupHeaderProps, CensusScope, UseCensusResponse } from './types'
import { useCensusFields } from './hooks'
import { setCensusField } from './utils'
import { censusGroupHeadings } from './config'

// TODO: reuse the stuff from SearchByOmni, they're nearly identical
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    // NOTE: there are also overrides in style.css (giant mess)
    root: {
      marginBottom: '1rem',
      // The search box itself
      '& .MuiInputBase-root:not(.Mui-disabled)': {
        backgroundColor: '#fff',
      },
      // Search icon on left side
      '& .MuiInputAdornment-root': {
        color: theme.palette.grey[500],
      },
      // Cheap gross way to show icon against white input BG override
      '& .MuiSvgIcon-root': {
        // Tried secondary text color without luck. Maybe alpha breaks it?
        fill: theme.palette.grey[500],
      },
    },
    paper: {
      // Stands out against panels behind it
      backgroundColor: theme.palette.background.default,
    },
    listbox: {
      paddingTop: 0,
      [theme.breakpoints.down('sm')]: {
        maxHeight: 225, // maybe helps prevent unwanted upward-opening menu?
      },
    },
    groupHeader: {
      backgroundColor: theme.palette.secondary.main,
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
    input: {
      color: theme.palette.grey[700],
      fontSize: '1rem',
      // Make text more opaque than the 0.5 default
      // CRED: https://stackoverflow.com/a/48545561/1048518
      '&::placeholder': {
        opacity: 0.85, // 0.5 default makes it too light
        color: theme.palette.grey[500],
      },
    },
  })
)

const CensusGroupHeader: FC<GroupHeaderProps> = (props) => {
  const { title, censusScope } = props
  const classes = useStyles()
  const { text: subTitle } = useUItext(
    `census-search-${censusScope}-heading` as UItextTableID
  )

  return (
    <ListSubheader className={classes.groupHeader}>
      <Typography className={classes.groupTitle} variant="h6">
        {title}
      </Typography>
      <Typography className={classes.groupSubTitle}>
        {/* Prevent jank on group headings when dynamic AT text arrives */}
        {subTitle || '\u00A0'}
      </Typography>
    </ListSubheader>
  )
}

const renderGroup = (params: AutocompleteRenderGroupParams) => {
  const groupConfig = censusGroupHeadings[params.group as CensusScope]
  const { title } = groupConfig

  return [
    <CensusGroupHeader
      key={params.key}
      title={title}
      censusScope={params.group as CensusScope}
    />,
    params.children,
  ]
}

export const CensusFieldSelect: FC = (props) => {
  const classes = useStyles()
  const mapToolsDispatch = useMapToolsDispatch()
  const { censusActiveField } = useMapToolsState()
  const { data, isLoading, error } = useCensusFields()
  const { text: placeholderText } = useUItext('census-search-placeholder')
  const history = useHistory()

  const defaultValue =
    data.find(({ id }) => id === censusActiveField?.id) || null

  const handleChange = (value: UseCensusResponse | null) => {
    setCensusField(value, mapToolsDispatch)
    // TODO: UGHHHH don't transition/animate panels on stuff like this!
    history.push(routes.local) // clears any census popups
  }

  // TODO: reuse in utils (nearly identical to Omnibox)
  let placeholder: string
  const problemo = error !== null || (!isLoading && !data.length)
  const errorText = 'Could not get census data'
  const loadingText = 'Loading census data...'

  if (isLoading) placeholder = loadingText
  else if (problemo) placeholder = errorText
  else placeholder = placeholderText

  return (
    <Autocomplete
      id="census-autocomplete"
      classes={{
        root: classes.root,
        option: classes.option,
        listbox: classes.listbox,
        paper: classes.paper,
        input: classes.input,
      }}
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
      loadingText={loadingText} // does nothing
      disabled={isLoading || problemo}
      color="secondary"
      onChange={(event, value) => handleChange(value)}
      options={data}
      renderGroup={renderGroup}
      selectOnFocus={false}
      size="small"
      value={defaultValue}
      // open // much more effective than `debug`
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={placeholder}
          variant="outlined"
          helperText={<UItextFromAirtable id="census-search-helper" />}
          InputLabelProps={{ disableAnimation: true, shrink: true }}
          FormHelperTextProps={{ variant: 'outlined' }}
        />
      )}
    />
  )
}

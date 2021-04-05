import React, { FC } from 'react'
import { useHistory } from 'react-router-dom'
import matchSorter from 'match-sorter'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { TextField, InputAdornment } from '@material-ui/core'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { MdClose } from 'react-icons/md'
import { GoSearch } from 'react-icons/go'

import { useAirtable } from 'components/explore/hooks'
import { LangLevelReqd } from 'components/context/types'
import { sortArrOfObjects } from 'components/legend/utils'
import { useUItext } from 'components/generic'
import { OmniboxResult } from './OmniboxResult'
import { ListboxComponent } from './ListboxComponent'
import { renderGroup, prepAutocompleteGroups } from './utils'
import { PreppedAutocompleteGroup } from './types'

// TODO: maybe this: https://github.com/mui-org/material-ui/issues/4393
// ...to make sure it fits on iPhone?
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    // NOTE: there are also overrides in style.css (giant mess)
    root: {
      marginBottom: '0.5rem',
      // The search box itself
      '& .MuiInputBase-root': {
        backgroundColor: '#fff',
      },
      // Search icon on left side
      '& .MuiInputAdornment-root': {
        color: theme.palette.grey[500],
      },
      [theme.breakpoints.down('sm')]: {
        marginBottom: '0.25rem',
      },
    },
    paper: {
      // Stands out against panels behind it
      backgroundColor: theme.palette.background.default,
    },
    listbox: {
      '& ul': {
        margin: 0,
        padding: 0,
      },
      // Group headings
      '& .MuiListSubheader-root': {
        borderBottom: `1px solid ${theme.palette.text.hint}`,
        color: theme.palette.text.primary,
        fontFamily: theme.typography.h1.fontFamily,
        fontSize: '1.25rem',
        fontWeight: theme.typography.h1.fontWeight,
        paddingLeft: 12,
      },
    },
    // The <li> items. Not sure why it works via classes and `groupUl` doesn't.
    option: {
      borderBottom: `solid 1px ${theme.palette.divider}`,
      display: 'flex',
      paddingLeft: 12,
    },
    input: {
      color: theme.palette.grey[700],
      fontSize: '1rem',
      // Make text more opaque than the 0.5 default
      // CRED: https://stackoverflow.com/a/48545561/1048518
      '&::placeholder': {
        opacity: 0.85,
      },
    },
  })
)

const fields = [
  'name',
  'Endonym',
  'Glottocode',
  'ISO 639-3',
  'instanceIDs',
  'Primary Locations',
]

// CRED: https://material-ui.com/components/autocomplete/#virtualization
// ^^^ definitely wouldn't have gotten the `react-window` virtualization w/o it!
export const SearchByOmnibox: FC = (props) => {
  const { data, isLoading, error } = useAirtable<LangLevelReqd>('Language', {
    fields,
    sort: [{ field: 'name' }],
  })
  const classes = useStyles()
  const history = useHistory()
  const { text: placeholderText } = useUItext('omni-placeholder')

  if (error) return <div>Something went wrong fetching search data.</div>

  const options = prepAutocompleteGroups(data).sort(
    sortArrOfObjects<PreppedAutocompleteGroup>('location')
  )

  return (
    <Autocomplete
      id="virtualize-demo"
      classes={classes}
      closeIcon={<MdClose />}
      // Thought this helped to resolve iOS zoom issue but the cause seems to be
      // when <input> font size is smaller than the page default.
      // blurOnSelect="touch"
      // open // much more effective than `debug`
      // openOnFocus // TODO: rm if not using. Seems fine without it?
      groupBy={(option) => option.name}
      getOptionLabel={(option) => option.name}
      options={options}
      loading={isLoading}
      loadingText="Loading language data..."
      renderGroup={renderGroup}
      renderOption={(option) => <OmniboxResult data={option} />}
      size="small"
      popupIcon={null}
      onChange={(event, value) => {
        // Can't just do <RouterLink>, otherwise keyboard selection no-go...
        if (value) history.push(`/Explore/Language/${value.name}/${value.id}`)
      }}
      filterOptions={(opts, { inputValue }) => {
        return matchSorter(opts, inputValue, {
          keys: ['name', 'Endonym', 'ISO 639-3', 'Glottocode'],
          threshold: matchSorter.rankings.WORD_STARTS_WITH,
        })
      }}
      ListboxComponent={
        ListboxComponent as React.ComponentType<
          React.HTMLAttributes<HTMLElement>
        >
      }
      renderInput={(params) => {
        // eslint-disable-next-line no-param-reassign
        params.InputProps.startAdornment = (
          <>
            <InputAdornment position="start">
              <GoSearch />
            </InputAdornment>
            {params.InputProps.startAdornment}
          </>
        )

        return (
          <TextField
            {...params}
            variant="outlined"
            color="secondary"
            placeholder={placeholderText}
          />
        )
      }}
    />
  )
}

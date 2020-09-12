import React, { FC } from 'react'
import { useHistory } from 'react-router-dom'
import matchSorter from 'match-sorter'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { TextField } from '@material-ui/core'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { MdClose } from 'react-icons/md'

import { paths as routes } from 'components/config/routes'
import { LangRecordSchema } from '../../context/types'
import { OmniboxResult } from './OmniboxResult'
import { FiltersWarning } from './FiltersWarning'
import { ListboxComponent } from './ListboxComponent'
import { renderGroup } from './utils'

type SearchByOmniProps = {
  data: LangRecordSchema[]
}

// TODO: maybe this: https://github.com/mui-org/material-ui/issues/4393
// ...to make sure it fits on iPhone?
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginBottom: '1em',
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
        fontSize: '1.1rem',
        paddingLeft: 12,
      },
    },
    // The <li> items. Not sure why it works via classes and `groupUl` doesn't.
    option: {
      borderBottom: `solid 1px ${theme.palette.divider}`,
      display: 'flex',
      paddingLeft: 12,
    },
    inputRoot: {
      // Decrease placeholder font size but prevent unwanted iOS zoom on focus
      '& input:not(:focus)': { fontSize: '0.8em' },
    },
  })
)

// CRED: https://material-ui.com/components/autocomplete/#virtualization
// ^^^ definitely wouldn't have gotten the `react-window` virtualization w/o it!
export const SearchByOmnibox: FC<SearchByOmniProps> = (props) => {
  const { data } = props
  const classes = useStyles()
  const history = useHistory()

  return (
    <Autocomplete
      id="virtualize-demo"
      classes={classes}
      closeIcon={<MdClose />}
      blurOnSelect="touch" // helps to resolve iOS zoom issue. Don't... touch!
      // open // much more effective than `debug`
      getOptionLabel={(option) => option.Language}
      groupBy={(option) => option.Language}
      options={data}
      renderGroup={renderGroup}
      renderOption={(option) => <OmniboxResult data={option} />}
      size="small"
      popupIcon={null}
      onChange={(event, value) => {
        // Can't just do <RouterLink>, otherwise keyboard selection no-go...
        if (value) history.push(`${routes.details}?id=${value.ID}`)
      }}
      filterOptions={(options, { inputValue }) => {
        return matchSorter(options, inputValue, {
          keys: ['Language', 'Endonym', 'ISO 639-3', 'Glottocode'],
          threshold: matchSorter.rankings.WORD_STARTS_WITH,
        })
      }}
      ListboxComponent={
        ListboxComponent as React.ComponentType<
          React.HTMLAttributes<HTMLElement>
        >
      }
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Language, endonym, Glottocode, or ISO 639-3"
          helperText={<FiltersWarning />}
          InputLabelProps={{ disableAnimation: true, shrink: true }}
        />
      )}
    />
  )
}

import React, { FC } from 'react'
import { useHistory } from 'react-router-dom'
import matchSorter from 'match-sorter'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { TextField } from '@material-ui/core'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { MdClose } from 'react-icons/md'

import { paths as routes } from 'components/config/routes'
import { LangRecordSchema } from 'components/context/types'
import { OmniboxResult } from './OmniboxResult'
import { ListboxComponent } from './ListboxComponent'
import { renderGroup } from './utils'

type SearchByOmniProps = {
  data: LangRecordSchema[]
}

// TODO: maybe this: https://github.com/mui-org/material-ui/issues/4393
// ...to make sure it fits on iPhone?
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
        fontSize: '1.1rem',
        paddingLeft: 12,
        fontWeight: theme.typography.h1.fontWeight,
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
      // Thought this helped to resolve iOS zoom issue but the cause seems to be
      // when <input> font size is smaller than the page default.
      // blurOnSelect="touch"
      // open // much more effective than `debug`
      // openOnFocus // TODO: rm if not using. Seems fine without it?
      getOptionLabel={(option) => option.Language}
      groupBy={(option) => option.Language}
      options={data}
      renderGroup={renderGroup}
      renderOption={(option) => <OmniboxResult data={option} />}
      size="small"
      popupIcon={null}
      onChange={(event, value) => {
        // Can't just do <RouterLink>, otherwise keyboard selection no-go...
        if (value) history.push(`${routes.details}/${value.id}`)
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
          InputLabelProps={{ disableAnimation: true, shrink: true }}
        />
      )}
    />
  )
}

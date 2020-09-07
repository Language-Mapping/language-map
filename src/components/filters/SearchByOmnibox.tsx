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
  noFiltersSet: boolean
  data: LangRecordSchema[]
}

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
  })
)

// CRED: https://material-ui.com/components/autocomplete/#virtualization
// ^^^ definitely wouldn't have gotten the `react-window` virtualization w/o it!
export const SearchByOmnibox: FC<SearchByOmniProps> = (props) => {
  const { data, noFiltersSet } = props
  const classes = useStyles()
  const history = useHistory()

  return (
    <Autocomplete
      id="virtualize-demo"
      classes={classes}
      // autoComplete // TODO: yay or nay?
      autoHighlight
      closeIcon={<MdClose />}
      size="small"
      options={data}
      // open // much more effective than `debug`
      groupBy={(option) => option.Language}
      getOptionLabel={(option) => option.Language}
      renderGroup={renderGroup}
      renderOption={(option) => <OmniboxResult data={option} />}
      openOnFocus
      onChange={(event, value) => {
        // Can't just do <RouterLink>, otherwise keyboard selection no-go...
        if (value) {
          history.push(`${routes.details}?id=${value.ID}`)
        }
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
          label="Language, endonym, Glottocode, ISO 639-3"
          placeholder="Search language communities..."
          helperText={noFiltersSet ? <FiltersWarning /> : null}
          InputLabelProps={{
            disableAnimation: true,
            shrink: true,
          }}
        />
      )}
    />
  )
}

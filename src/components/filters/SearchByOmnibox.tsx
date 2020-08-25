import React, { FC } from 'react'
import { useHistory } from 'react-router-dom'
import matchSorter from 'match-sorter'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import Typography from '@material-ui/core/Typography'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { MdClose } from 'react-icons/md'

import { RouteLocation } from 'components/map/types'
import { LangRecordSchema } from '../../context/types'
import { OmniboxResult } from './OmniboxResult'
import { FiltersWarning } from './FiltersWarning'
import { ListboxComponent } from './ListboxComponent'
import { renderGroup } from './utils'

type SearchByOmniProps = {
  noFiltersSet: boolean
  data: LangRecordSchema[]
}

const detailsRoutePath: RouteLocation = '/details'

const useStylesDirect = makeStyles({
  listbox: {
    boxSizing: 'border-box',
    '& ul': {
      padding: 0,
      margin: 0,
    },
  },
})

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    omniLabel: {
      color: theme.palette.primary.main,
      fontSize: '1rem', // default causes wrap on small screens
    },
  })
)

const OmniLabel: FC = () => {
  const classesOrig = useStyles()

  return (
    <Typography className={classesOrig.omniLabel}>
      Language, endonym, Glottocode, ISO 639-3
    </Typography>
  )
}

export const SearchByOmnibox: FC<SearchByOmniProps> = (props) => {
  const { data, noFiltersSet } = props
  const classes = useStylesDirect()
  const history = useHistory()

  return (
    <Autocomplete
      id="virtualize-demo"
      classes={classes}
      // autoComplete // TODO: yay or nay?
      autoHighlight
      closeIcon={<MdClose />}
      size="small"
      groupBy={(option) => option.Language}
      options={data}
      getOptionLabel={(option) => option.Language}
      renderGroup={renderGroup}
      renderOption={(option) => <OmniboxResult data={option} />}
      onChange={(event, value) => {
        // Can't just do <RouterLink>, otherwise keyboard selection no-go...
        if (value) {
          history.push(`${detailsRoutePath}?id=${value.ID}`)
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
          label={<OmniLabel />}
          placeholder="Search language communities..."
          helperText={noFiltersSet ? <FiltersWarning /> : null}
          InputLabelProps={{
            disableAnimation: true,
            focused: false,
            shrink: true,
          }}
        />
      )}
    />
  )
}

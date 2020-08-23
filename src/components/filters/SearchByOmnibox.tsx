import React, { FC } from 'react'
import matchSorter from 'match-sorter'
import { useHistory } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { TextField, Link, Typography } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { MdClose } from 'react-icons/md'
import { TiWarning } from 'react-icons/ti'

import { RouteLocation } from 'components/map/types'
import { LangRecordSchema } from '../../context/types'

type OmniboxComponent = {
  data: LangRecordSchema[]
  enableClear: boolean
  clearFilters: () => void
}

type FiltersWarningComponent = Pick<OmniboxComponent, 'clearFilters'>

const detailsRoutePath: RouteLocation = '/details'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    omniboxRoot: {
      marginBottom: '1rem',
      marginTop: '0.5rem',
    },
    omniLabel: {
      color: theme.palette.primary.main,
      fontSize: '1rem', // default causes wrap on small screens
    },
    filtersWarning: {
      display: 'flex',
      alignItems: 'center',
      fontSize: '.8rem',
      '& > a': {
        fontWeight: 'bold',
      },
      '& > svg': {
        marginRight: '0.4em',
      },
    },
  })
)

// The text above the text field. Kind of a fight w/MUI stuff...
const OmniLabel: FC = () => {
  const classes = useStyles()

  return (
    <div className={classes.omniLabel}>
      Language, endonym, Glottocode, ISO 639-3
    </div>
  )
}

// NOTE: the future of this is pending convo:
// Let user know that they are searching filtered data
const FiltersWarning: FC<FiltersWarningComponent> = (props) => {
  const classes = useStyles()
  const { clearFilters } = props

  return (
    <Typography className={classes.filtersWarning}>
      <TiWarning />
      Data search includes current filters.&nbsp;
      <Link
        href="#"
        onClick={(e: React.MouseEvent) => {
          e.preventDefault()
          clearFilters()
          e.stopPropagation()
        }}
      >
        Clear filters
      </Link>
    </Typography>
  )
}

export const SearchByOmnibox: FC<OmniboxComponent> = (props) => {
  const history = useHistory()
  const classes = useStyles()
  const { data, enableClear, clearFilters } = props

  return (
    <Autocomplete
      id="language-omnibox"
      className={classes.omniboxRoot}
      autoComplete
      autoHighlight
      closeIcon={<MdClose />}
      // debug // TODO: rm when done
      defaultValue={null}
      fullWidth={false}
      groupBy={(option) => option.Language}
      options={data}
      size="small"
      onChange={(event, value) => {
        if (value) {
          history.push(`${detailsRoutePath}?id=${value.ID}`)
        }
      }}
      renderOption={(option) => {
        return <>{option.Neighborhoods || option.Town}</>
      }}
      filterOptions={(options, { inputValue }) => {
        return matchSorter(options, inputValue, {
          keys: ['Language', 'Endonym', 'ISO 639-3', 'Glottocode'],
        })
      }}
      renderInput={(params) => (
        <>
          <TextField
            {...params}
            label={<OmniLabel />}
            placeholder="Search language communities..."
            helperText={
              enableClear && <FiltersWarning clearFilters={clearFilters} />
            }
            InputLabelProps={{
              shrink: true,
              focused: false,
              disableAnimation: true,
            }}
          />
        </>
      )}
    />
  )
}

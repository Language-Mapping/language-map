import React, { FC } from 'react'
import matchSorter from 'match-sorter'
import { useHistory } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { TextField } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { MdClose } from 'react-icons/md'

import { RouteLocation } from 'components/map/types'
import { LangRecordSchema } from '../../context/types'

type OmniboxComponent = {
  data: LangRecordSchema[]
}

const detailsRoutePath: RouteLocation = '/details'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    omniboxRoot: {
      marginBottom: theme.spacing(1),
    },
  })
)

export const SearchByOmnibox: FC<OmniboxComponent> = (props) => {
  const history = useHistory()
  const classes = useStyles()
  const { data } = props

  return (
    <Autocomplete
      id="language-omnibox"
      className={classes.omniboxRoot}
      autoComplete
      autoHighlight
      closeIcon={<MdClose />}
      // debug // TODO: rm when done
      forcePopupIcon
      fullWidth
      groupBy={(option) => option.Language}
      options={data}
      size="small"
      onChange={(event, value) => {
        if (value) {
          history.push(`${detailsRoutePath}?id=${value.ID}`)
        }
      }}
      // TODO: use getOptionLabel if nothing custom needed
      renderOption={(option) => {
        return <>{option.Neighborhoods || option.Town}</>
      }}
      filterOptions={(options, { inputValue }) => {
        return matchSorter(options, inputValue, {
          keys: ['Language', 'Endonym', 'ISO 639-3', 'Glottocode'],
        })
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          helperText="Enter a language, endonym, Glottocode, or ISO"
          label="Search data (TODO: mention filters?)..."
          placeholder="Click a result to view in map"
          size="small"
          // InputProps={{ }}
        />
      )}
    />
  )
}

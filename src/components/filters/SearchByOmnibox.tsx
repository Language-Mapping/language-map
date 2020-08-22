import React, { FC } from 'react'
import matchSorter from 'match-sorter'
import { useHistory } from 'react-router-dom'
import { TextField } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { MdClose } from 'react-icons/md'

import { RouteLocation } from 'components/map/types'
import { LangRecordSchema } from '../../context/types'

const detailsRoutePath: RouteLocation = '/details'

type OmniboxComponent = {
  data: LangRecordSchema[]
}

export const SearchByOmnibox: FC<OmniboxComponent> = (props) => {
  const history = useHistory()
  const { data } = props

  return (
    <Autocomplete
      id="language-omnibox"
      options={data}
      autoHighlight
      autoComplete
      fullWidth
      closeIcon={<MdClose />}
      // debug // TODO: rm when done
      onChange={(event, value) => {
        if (value) {
          history.push(`${detailsRoutePath}?id=${value.ID}`)
        }
      }}
      forcePopupIcon
      groupBy={(option) => option.Language}
      getOptionLabel={(option) => option.Neighborhoods || option.Town}
      filterOptions={(options, { inputValue }) => {
        return matchSorter(options, inputValue, {
          keys: ['Language', 'Endonym', 'ISO 639-3', 'Glottocode'],
        })
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Lang, endo, glotto, iso"
          variant="outlined"
          size="small"
        />
      )}
    />
  )
}

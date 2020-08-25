import React, { FC } from 'react'
import matchSorter from 'match-sorter'
import { useHistory } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { TextField, Link, Typography } from '@material-ui/core'
import Autocomplete, {
  AutocompleteRenderGroupParams,
} from '@material-ui/lab/Autocomplete'
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

// This basically seems to jack up any nice looking output whatsover, but it IS
// sorted without having to loop over the entire dataset, only the group.
const renderGroup = (params: AutocompleteRenderGroupParams) => {
  const { children } = params
  const asArray = React.Children.toArray(children)
  const moreThan1 = React.Children.count(params.children) > 1

  if (!moreThan1) {
    return [
      <React.Fragment key={params.key}>{params.group}</React.Fragment>,
      params.children,
    ]
  }

  const sorted = asArray.sort((a, b) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const kidsA = a.props.children.props.children
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const kidsB = b.props.children.props.children

    return kidsA < kidsB ? -1 : 1
  })

  return [
    <React.Fragment key={params.key}>{params.group}</React.Fragment>,
    sorted,
  ]
}

// TODO: rule out that no additional features are needed from match-sorter:
// https://github.com/kentcdodds/match-sorter
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
      renderGroup={renderGroup}
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
          threshold: matchSorter.rankings.WORD_STARTS_WITH,
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
              disableAnimation: true,
              focused: false,
              shrink: true,
            }}
          />
        </>
      )}
    />
  )
}

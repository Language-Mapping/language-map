import React, { FC } from 'react'
import { useHistory } from 'react-router-dom'
import matchSorter from 'match-sorter'
import TextField from '@material-ui/core/TextField'
import Autocomplete, {
  AutocompleteRenderGroupParams,
} from '@material-ui/lab/Autocomplete'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import ListSubheader from '@material-ui/core/ListSubheader'
import Typography from '@material-ui/core/Typography'
import {
  useTheme,
  makeStyles,
  Theme,
  createStyles,
} from '@material-ui/core/styles'
import { VariableSizeList, ListChildComponentProps } from 'react-window'
import { MdClose } from 'react-icons/md'

import { RouteLocation } from 'components/map/types'
import { LangRecordSchema } from '../../context/types'
import { OmniboxResult } from './OmniboxResult'
import { FiltersWarning } from './FiltersWarning'

type OmniVirtualProps = {
  noFiltersSet: boolean
  data: LangRecordSchema[]
}

const detailsRoutePath: RouteLocation = '/details'
const LISTBOX_PADDING = 8 // px

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

const OuterElementContext = React.createContext({})

// eslint-disable-next-line react/display-name
const OuterElementType = React.forwardRef<HTMLDivElement>((props, ref) => {
  const outerProps = React.useContext(OuterElementContext)

  return <div ref={ref} {...props} {...outerProps} />
})

function renderRow(props: ListChildComponentProps) {
  const { data, index, style } = props

  return React.cloneElement(data[index], {
    style: {
      ...style,
      top: (style.top as number) + LISTBOX_PADDING,
    },
  })
}

function useResetCache(itemCount: number) {
  const ref = React.useRef<VariableSizeList>(null)

  React.useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true)
    }
  }, [itemCount])

  return ref
}

const OmniLabel: FC = () => {
  const classesOrig = useStyles()

  return (
    <Typography className={classesOrig.omniLabel}>
      Language, endonym, Glottocode, ISO 639-3
    </Typography>
  )
}

// TODO: new file
// Adapter for react-window
const ListboxComponent = React.forwardRef<HTMLDivElement>(
  function ListboxComponent(props, ref) {
    const { children, ...other } = props
    const itemData = React.Children.toArray(children)
    const theme = useTheme()
    const smUp = useMediaQuery(theme.breakpoints.up('sm'), { noSsr: true })
    const itemCount = itemData.length
    const itemSize = smUp ? 36 : 48

    const getChildSize = (child: React.ReactNode) => {
      if (React.isValidElement(child) && child.type === ListSubheader) {
        return 48
      }

      return itemSize
    }

    const getHeight = () => {
      if (itemCount > 8) {
        return 8 * itemSize
      }

      return itemData.map(getChildSize).reduce((a, b) => a + b, 0)
    }

    const gridRef = useResetCache(itemCount)

    return (
      <div ref={ref}>
        <OuterElementContext.Provider value={other}>
          <VariableSizeList
            height={getHeight() + 2 * LISTBOX_PADDING}
            innerElementType="ul"
            itemCount={itemCount}
            itemData={itemData}
            itemSize={(index) => getChildSize(itemData[index])}
            outerElementType={OuterElementType}
            overscanCount={5}
            ref={gridRef}
            width="100%"
          >
            {renderRow}
          </VariableSizeList>
        </OuterElementContext.Provider>
      </div>
    )
  }
)

const renderGroup = (params: AutocompleteRenderGroupParams) => {
  const { children } = params
  const asArray = React.Children.toArray(children)
  const moreThan1 = React.Children.count(params.children) > 1

  if (!moreThan1) {
    return [
      <ListSubheader key={params.key} component="div">
        {params.group}
      </ListSubheader>,
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
    <ListSubheader key={params.key} component="div">
      {params.group}
    </ListSubheader>,
    sorted,
  ]
}

export const SearchByOmnibox: FC<OmniVirtualProps> = (props) => {
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

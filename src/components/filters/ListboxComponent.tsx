import React from 'react'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import ListSubheader from '@material-ui/core/ListSubheader'
import { useTheme } from '@material-ui/core/styles'
import { VariableSizeList, ListChildComponentProps } from 'react-window'

import { useResetCache } from './utils'

const LISTBOX_PADDING = 8 // px
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

// Adapter for react-window
export const ListboxComponent = React.forwardRef<HTMLDivElement>(
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

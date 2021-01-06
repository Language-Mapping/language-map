import React from 'react'
import { ListSubheader } from '@material-ui/core'
import { VariableSizeList, ListChildComponentProps } from 'react-window'

import { useResetCache } from './utils'
import { isTouchEnabled } from '../../utils'

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
    const itemCount = itemData.length
    const itemSize = 48 // orig: smUp ? 24 : 36
    // AWFUL but works to prevent erratic mobile list direction
    const menuHeight = isTouchEnabled() ? 150 : 250

    // NOTE: setting the <li> height and `.MuiListSubheader-root` (group
    // headings) heights here is super fragile since it's not part of the styles
    // definitions in the Omnibox component. These settings look pretty good
    // across screen sizes though, with the exception of excessively long
    // neighborhood values.
    const getChildSize = (child: React.ReactNode) => {
      // The `Language` group headings
      if (React.isValidElement(child) && child.type === ListSubheader) {
        return 36
      }

      return itemSize
    }

    // TODO: rm if not using, but this was from the example. It just caused
    // erratic behavior on iOS in terms of which direction the list would open.
    // More than 3ish items meant upward, otherwise down.
    // const getHeight = () => {
    //   if (itemCount > 8) return 8 * itemSize

    //   return itemData.map(getChildSize).reduce((a, b) => a + b, 0)
    // }

    const gridRef = useResetCache(itemCount)

    return (
      <div ref={ref}>
        <OuterElementContext.Provider value={other}>
          <VariableSizeList
            // TODO: rm if not using (see note above)
            // height={getHeight() + 2 * LISTBOX_PADDING}
            height={menuHeight}
            innerElementType="ul"
            itemCount={itemCount}
            itemData={itemData}
            itemSize={(index) => getChildSize(itemData[index])}
            outerElementType={OuterElementType}
            overscanCount={10}
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

import React from 'react'
import { VariableSizeList } from 'react-window'
import { AutocompleteRenderGroupParams } from '@material-ui/lab/Autocomplete'
import ListSubheader from '@material-ui/core/ListSubheader'

export function useResetCache(
  itemCount: number
): React.RefObject<VariableSizeList> {
  const ref = React.useRef<VariableSizeList>(null)

  React.useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true)
    }
  }, [itemCount])

  return ref
}

// Hey I tried
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const renderGroup = (params: AutocompleteRenderGroupParams) => {
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

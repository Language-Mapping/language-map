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

  // This whole thing is super dicey. Not much advice/encouragement for messing
  // with React children as a consistent sorting source, but it seems to work.
  const sorted = asArray.sort((a, b) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const aData = a.props.children.props.data
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const bData = b.props.children.props.data

    return aData.Neighborhoods < bData.Neighborhoods ? -1 : 1

    // NOTE: when there is no Neighborhood for one instance of a Language (e.g. in New Jersey) but there is for another, the former will show up first. Would need to address this separately
    // TODO: rm all this if giving up on sorting by Town AND Neighborhood
    // // A hoods exist, but not B
    // if (aData.Neighborhoods && aData.Neighborhoods < bData.Town) return -1
    // // B hoods exist, but not A
    // if (bData.Neighborhoods && aData.Town < bData.Neighborhoods) return -1
    // // No hoods, just towns
    // if (aData.Town < bData.Town) return -1
    // return 1
  })

  return [
    <ListSubheader key={params.key} component="div">
      {params.group}
    </ListSubheader>,
    sorted,
  ]
}

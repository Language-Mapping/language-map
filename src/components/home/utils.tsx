import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { VariableSizeList } from 'react-window'
import { AutocompleteRenderGroupParams } from '@material-ui/lab/Autocomplete'
import ListSubheader from '@material-ui/core/ListSubheader'

import { LangLevelSchema } from 'components/context/types'
import { PreppedAutocompleteGroup } from './types'

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
  return [
    // Could NOT get it to style properly if setting component to anything but
    // "div" and could not make it stay sticky either. Frustration station.
    <ListSubheader key={params.group} component="div">
      <RouterLink to={`/Explore/Language/${params.group}`}>
        {params.group}
      </RouterLink>
    </ListSubheader>,
    params.children,
  ]
}

export const prepAutocompleteGroups = (
  data: LangLevelSchema[]
): PreppedAutocompleteGroup[] =>
  data?.reduce((all: PreppedAutocompleteGroup[], thisOne) => {
    return [
      ...all,
      ...thisOne.instanceIDs?.map((id, i) => {
        return {
          ...thisOne,
          id,
          location: thisOne['Primary Locations'][i],
        }
      }),
    ] as PreppedAutocompleteGroup[]
  }, [])

import React, { FC, useState } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'

import { BottomNav } from 'components'
import { Map, MapPanel } from 'components/map'
import { initialMapState } from 'components/map/config'

// const fillItUp = {
//   bottom: 0,
//   position: 'absolute',
//   top: 0,
//   width: '100%',
// }

const useStyles = makeStyles(() =>
  createStyles({
    mapWrapRoot: {
      // ...fillItUp, // TODO: ???
      bottom: 0,
      position: 'absolute',
      top: 0,
      width: '100%',
    },
    mapItselfWrap: {
      bottom: 0,
      position: 'absolute',
      top: 0,
      width: '100%',
    },
  })
)

const panelsConfig = [
  {
    heading: 'Explore',
    content: 'Query, search, filter, what have you',
  },
  {
    heading: 'Results',
    content: 'Table or list of results',
  },
  {
    heading: 'Details',
    content: 'Detailed info on a specific selected individual point',
  },
]

export const MapWrap: FC = () => {
  const classes = useStyles()
  const [value, setValue] = useState(0)

  return (
    <div className={classes.mapWrapRoot}>
      <div className={classes.mapItselfWrap}>
        <Map {...initialMapState} />
      </div>
      <MapPanel heading={panelsConfig[value].heading} position="open">
        {panelsConfig[value].content}
      </MapPanel>
      <BottomNav value={value} setValue={setValue} />
    </div>
  )
}

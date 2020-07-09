import React, { FC, useState } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Box } from '@material-ui/core'

import { BottomNav } from 'components'
import { Map, MapPanel, MapLayersPopout } from 'components/map'
import { initialMapState } from 'components/map/config'

// TODO: rm if not using, but understand why it breaks
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
    subheading: 'Searching, filtering, etc.',
    content:
      'This panel would be shown first since it is what we want the user to see before diving into anything else.',
  },
  {
    heading: 'Results',
    subheading: 'Table or list of results',
    content:
      'Not a ton of room here, should other options be considered? Might be cool as a "Grid View" too.',
  },
  {
    heading: 'Details',
    subheading: '...of selected feature',
    content:
      'Detailed info on a specific selected individual point. Will be triggered by clicking a record in Results panel or a "View Details" button from within a popup when a point is clicked in the map.',
  },
]

export const MapWrap: FC = () => {
  const classes = useStyles()
  const [value, setValue] = useState(0)

  return (
    <div className={classes.mapWrapRoot}>
      <div className={classes.mapItselfWrap}>
        <Map {...initialMapState} />
        <Box position="absolute" top={60} right={8} zIndex={1}>
          <MapLayersPopout />
        </Box>
      </div>
      {panelsConfig.map((config) => (
        <MapPanel
          key={config.heading}
          heading={panelsConfig[value].heading}
          content={panelsConfig[value].content}
          subheading={panelsConfig[value].subheading}
          position="open"
        />
      ))}
      <BottomNav value={value} setValue={setValue} />
    </div>
  )
}

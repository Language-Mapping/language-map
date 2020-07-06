import React, { FC } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'

import { BottomNav } from 'components'
import { Map } from 'components/map'
import { initialMapState } from 'components/map/config'

const useStyles = makeStyles(() =>
  createStyles({
    mapWrapRoot: {
      bottom: 0,
      display: 'flex',
      flexDirection: 'column',
      position: 'absolute',
      top: 0,
      width: '100%',
    },
    mapItselfWrap: {
      flex: 1,
    },
  })
)

export const MapWrap: FC = () => {
  const classes = useStyles()

  return (
    <div className={classes.mapWrapRoot}>
      <div className={classes.mapItselfWrap}>
        <Map {...initialMapState} />
      </div>
      <BottomNav />
    </div>
  )
}

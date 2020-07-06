import React, { FC, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { BottomNavigation, BottomNavigationAction } from '@material-ui/core'
import { FiLayers } from 'react-icons/fi'
import { FaSearch } from 'react-icons/fa'
import { TiDocumentText, TiThList } from 'react-icons/ti'

const useStyles = makeStyles({
  root: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
    '& svg': {
      height: 20,
      width: 20,
    },
  },
})

export const BottomNav: FC = () => {
  const classes = useStyles()
  const [value, setValue] = useState(0)

  return (
    <BottomNavigation
      showLabels
      className={classes.root}
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue)
      }}
    >
      <BottomNavigationAction label="Explore" icon={<FaSearch />} />
      <BottomNavigationAction label="Layers" icon={<FiLayers />} />
      <BottomNavigationAction label="Results" icon={<TiThList />} />
      <BottomNavigationAction label="Details" icon={<TiDocumentText />} />
    </BottomNavigation>
  )
}

import React, { FC, useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { BottomNavigation, BottomNavigationAction } from '@material-ui/core'
import { FiLayers } from 'react-icons/fi'
import { FaSearch } from 'react-icons/fa'
import { TiDocumentText, TiThList } from 'react-icons/ti'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    bottomNavRoot: {
      '& svg': {
        height: 20,
        width: 20,
      },
      [theme.breakpoints.up('sm')]: {
        width: 325,
        position: 'absolute',
        top: theme.spacing(8),
        left: theme.spacing(2),
      },
    },
  })
)

export const BottomNav: FC = () => {
  const classes = useStyles()
  const [value, setValue] = useState(0)

  return (
    <BottomNavigation
      showLabels
      className={classes.bottomNavRoot}
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

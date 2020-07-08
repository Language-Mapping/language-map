import React, { FC, useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { BottomNavigation, BottomNavigationAction } from '@material-ui/core'
import { FaSearch } from 'react-icons/fa'
import { TiDocumentText, TiThList } from 'react-icons/ti'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    bottomNavRoot: {
      position: 'absolute',
      left: theme.spacing(1),
      right: theme.spacing(1),
      bottom: theme.spacing(1),
      '& svg': {
        height: 20,
        width: 20,
      },
      [theme.breakpoints.up('sm')]: {
        width: 325,
        top: theme.spacing(8),
        left: theme.spacing(2),
      },
    },
  })
)

type BottomNavTypes = {
  value: number
  setValue: (value: number) => void
}

export const BottomNav: FC<BottomNavTypes> = ({ value, setValue }) => {
  const classes = useStyles()

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
      <BottomNavigationAction label="Results" icon={<TiThList />} />
      <BottomNavigationAction label="Details" icon={<TiDocumentText />} />
    </BottomNavigation>
  )
}

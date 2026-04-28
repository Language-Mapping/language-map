import React, { FC, PropsWithChildren } from 'react'
import { Theme } from '@mui/material'

import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'

import { TabPanelProps } from './types'

const useStyles = makeStyles((theme: Theme) => {
  const { palette } = theme

  return createStyles({
    root: {
      padding: '1rem',
      borderBottom: `solid 1px ${palette.divider}`,
      [theme.breakpoints.down('md')]: {
        padding: '0.75rem 0.5rem',
      },
    },
  })
})

export const TabPanel: FC<PropsWithChildren<TabPanelProps>> = (props) => {
  const { children, value, index, ...other } = props
  const classes = useStyles()

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`search-tabpanel-${index}`}
      aria-labelledby={`search-tab-${index}`}
      className={classes.root}
      {...other}
    >
      {value === index && <>{children}</>}
    </div>
  )
}

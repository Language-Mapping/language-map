import React, { FC, useState } from 'react'
import SwipeableViews from 'react-swipeable-views'
import AppBar from '@material-ui/core/AppBar'
import {
  createStyles,
  makeStyles,
  Tab,
  Tabs,
  Theme,
  useTheme,
} from '@material-ui/core'

import { SearchByOmnibox } from 'components/home/SearchByOmnibox'
import { GeocoderPopout } from 'components/map'
import { SlideDown } from 'components/generic'
import { FiltersWarning } from 'components/home/FiltersWarning'
import { SearchTabsProps, TabPanelProps } from './types'

const useStyles = makeStyles((theme: Theme) => {
  const { palette } = theme

  return createStyles({
    tabPanel: {
      padding: '1.25rem',
      borderBottom: `solid 1px ${theme.palette.divider}`,
      [theme.breakpoints.down('sm')]: {
        padding: '1rem 0.75rem',
      },
    },
    tabRoot: {
      fontSize: '0.85rem',
    },
    selected: {
      '&.search-tab': {
        color: palette.text.primary,
        borderColor: palette.secondary.light,
      },
    },
    textColorSecondary: {
      color: palette.text.secondary,
    },
  })
})

const a11yProps = (index: number) => ({
  id: `search-tab-${index}`,
  'aria-controls': `search-tabpanel-${index}`,
})

const TabPanel: FC<TabPanelProps> = (props) => {
  const { children, value, index, ...other } = props
  const classes = useStyles()

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`search-tabpanel-${index}`}
      aria-labelledby={`search-tab-${index}`}
      className={classes.tabPanel}
      {...other}
    >
      {value === index && <>{children}</>}
    </div>
  )
}

export const SearchTabs: FC<SearchTabsProps> = (props) => {
  const { mapRef, fixed, open } = props
  const classes = useStyles()
  const theme = useTheme()
  const [value, setValue] = useState<number>(0)

  const handleChange = (
    event: React.ChangeEvent<unknown>,
    newValue: number
  ) => {
    setValue(newValue)
  }

  const handleChangeIndex = (index: number) => {
    setValue(index)
  }

  const TabAppBar = (
    <AppBar position="static" color="transparent">
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="secondary"
        textColor="secondary"
        variant="fullWidth"
        aria-label="search panel"
      >
        <Tab
          className="search-tab"
          classes={{ selected: classes.selected, root: classes.tabRoot }}
          label="Search languages"
          {...a11yProps(0)}
        />
        <Tab
          className="search-tab"
          classes={{ selected: classes.selected, root: classes.tabRoot }}
          label="Search locations"
          {...a11yProps(1)}
        />
      </Tabs>
    </AppBar>
  )

  const TabMeat = (
    <SwipeableViews
      axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
      index={value}
      onChangeIndex={handleChangeIndex}
    >
      <TabPanel value={value} index={0}>
        <SearchByOmnibox />
        <FiltersWarning />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <GeocoderPopout mapRef={mapRef} />
      </TabPanel>
    </SwipeableViews>
  )

  if (!fixed)
    return (
      <>
        {TabAppBar}
        {TabMeat}
      </>
    )

  return (
    <SlideDown inProp={open as boolean}>
      {TabAppBar}
      {TabMeat}
    </SlideDown>
  )
}

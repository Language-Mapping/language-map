import React, { FC } from 'react'
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
import { GeocoderPopout, GeolocToggle } from 'components/map'
import { FiltersWarning } from 'components/home/FiltersWarning'
import { SearchTabsProps, TabPanelProps } from './types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tabPanel: {
      padding: '1rem 1.25rem 0',
      borderBottom: 'solid 1px #dcdcdc5c',
      [theme.breakpoints.down('sm')]: {
        padding: '0.75rem',
      },
    },
    wrapper: {
      color: theme.palette.secondary.light,
    },
    selected: {
      color: theme.palette.secondary.light,
    },
    textColorSecondary: {
      color: theme.palette.text.secondary,
    },
  })
)

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
  const { mapRef } = props
  const classes = useStyles()
  const theme = useTheme()
  const [value, setValue] = React.useState<number>(0)

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
    <AppBar position="static" color="default">
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="secondary"
        textColor="secondary"
        variant="fullWidth"
        aria-label="search panel"
      >
        <Tab
          classes={{ selected: classes.selected, wrapper: classes.wrapper }}
          label="Search languages"
          {...a11yProps(0)}
        />
        <Tab
          classes={{ selected: classes.selected, wrapper: classes.wrapper }}
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
        <GeolocToggle />
      </TabPanel>
    </SwipeableViews>
  )

  return (
    <>
      {TabAppBar}
      {TabMeat}
    </>
  )
}

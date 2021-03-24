import React, { FC } from 'react'
import SwipeableViews from 'react-swipeable-views'
import AppBar from '@material-ui/core/AppBar'
import useScrollTrigger from '@material-ui/core/useScrollTrigger'
import {
  createStyles,
  Fab,
  makeStyles,
  Tab,
  Tabs,
  Theme,
  useTheme,
  Zoom,
} from '@material-ui/core'
import { BiHomeAlt, BiUserVoice } from 'react-icons/bi'
import { FaSearchLocation } from 'react-icons/fa'

import { SearchByOmnibox } from 'components/home/SearchByOmnibox'
import {
  GeocoderPopout,
  GeolocToggle,
  LocationSearchContent,
} from 'components/map'
import { FiltersWarning } from 'components/home/FiltersWarning'
import { SearchTabsProps } from './types'

type Props = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window
  children: React.ReactElement
}

type TabPanelProps = {
  index: number
  value: number
}

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  }
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    backToTopBtn: {
      position: 'fixed',
      bottom: theme.spacing(1),
      right: 175,
      zIndex: 5000,
    },
    tabPanel: {
      padding: '0.75rem 0.75rem 0',
      minWidth: 325,
      [theme.breakpoints.down('sm')]: {
        minWidth: '100%',
        width: '100%',
      },
    },
    tabWrapper: {
      flexDirection: 'row',
      '& > *:first-child': {
        marginBottom: '0 !important',
        marginRight: 6,
      },
    },
    labelIcon: {
      minHeight: 32,
    },
    hideOnMobile: {
      marginRight: 4, // WOOOOOWWW how about a space
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },
  })
)

const TabPanel: FC<TabPanelProps> = (props) => {
  const { children, value, index, ...other } = props
  const classes = useStyles()

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      className={classes.tabPanel}
      {...other}
    >
      {value === index && <>{children}</>}
    </div>
  )
}

const HideOnMobile: FC<{ text: string }> = (props) => {
  const { text } = props
  const classes = useStyles()

  return (
    <>
      <span className={classes.hideOnMobile}>Search</span>
      {text}
    </>
  )
}

const ScrollTop: FC = (props) => {
  const { children } = props
  const classes = useStyles()
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    // target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 125, // threshold: 100
  })

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const anchor = (
      (event.target as HTMLDivElement).ownerDocument || document
    ).querySelector('#back-to-top-anchor')

    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  return (
    <Zoom in={trigger}>
      <div
        onClick={handleClick}
        role="presentation"
        className={classes.backToTopBtn}
      >
        {children}
      </div>
    </Zoom>
  )
}

export const SearchTabs: FC<SearchTabsProps> = (props) => {
  const { mapRef } = props
  const classes = useStyles()
  const [value, setValue] = React.useState<number>(0)
  const theme = useTheme()

  const handleChange = (
    event: React.ChangeEvent<unknown>,
    newValue: number
  ) => {
    setValue(newValue)
  }

  const handleChangeIndex = (index: number) => {
    setValue(index)
  }

  return (
    <div className={classes.root}>
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
            classes={{
              wrapper: classes.tabWrapper,
              labelIcon: classes.labelIcon,
            }}
            icon={<BiUserVoice />}
            label={<HideOnMobile text="Languages" />}
            {...a11yProps(0)}
          />
          <Tab
            classes={{
              wrapper: classes.tabWrapper,
              labelIcon: classes.labelIcon,
            }}
            icon={<FaSearchLocation />}
            label={<HideOnMobile text="Locations" />}
            {...a11yProps(1)}
          />
        </Tabs>
      </AppBar>
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
          <LocationSearchContent
            heading="Location tools"
            explanation="Enter an address, municipality, neighborhood, postal code, landmark, or other point of interest within the New York City metro area."
          >
            <GeocoderPopout mapRef={mapRef} />
            <GeolocToggle />
          </LocationSearchContent>
        </TabPanel>
      </SwipeableViews>
      <ScrollTop>
        <Fab color="secondary" size="small" aria-label="scroll back to top">
          <BiHomeAlt />
        </Fab>
      </ScrollTop>
    </div>
  )
}

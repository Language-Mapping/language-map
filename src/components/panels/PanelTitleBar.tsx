import React, { FC, useEffect } from 'react'
import {
  useLocation,
  Route,
  Switch,
  Link as RouterLink,
} from 'react-router-dom'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  Tooltip,
} from '@material-ui/core'
import { GoSearch } from 'react-icons/go'
import { MdClose } from 'react-icons/md'

import { HideOnScroll } from 'components/generic'
import { usePanelDispatch } from 'components/panels'
import { icons } from 'components/config'
import { SplitCrumbs } from './SplitCrumbs'

const topCornersRadius = 4 // same as bottom left/right in nav bar
const borderTopLeftRadius = topCornersRadius
const borderTopRightRadius = topCornersRadius

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      borderTopLeftRadius,
      borderTopRightRadius,
      // TODO: rm when done
      //   boxShadow: '0 2px 7px hsla(0, 0%, 0%, 0.25)',
      //   height: MOBILE_PANEL_HEADER_HT,
      //   position: 'absolute',
      //   top: 0,
      //   width: '100%',
    },
    colorDefault: {
      backgroundColor: 'transparent',
    },
    toolbar: {
      backgroundColor: theme.palette.primary.dark,
      borderTopLeftRadius,
      borderTopRightRadius,
      padding: '0 0.5rem',
      justifyContent: 'space-between',
    },
    panelTitleAndIcon: {
      display: 'flex',
      alignItems: 'center',
      '& > svg': {
        color: theme.palette.text.hint,
        marginRight: 4,
        fontSize: '1.25rem',
      },
    },
    panelTitleText: {
      fontSize: '1.5rem',
    },
    rightSideBtns: {
      '& > * + *': {
        marginLeft: 4,
      },
    },
  })
)

type PanelTitleProps = {
  text: string
  icon?: React.ReactNode
}

const PanelTitle: FC<PanelTitleProps> = (props) => {
  const { text, icon } = props
  const classes = useStyles()
  // TODO: make sure there are icons for all top-level views

  return (
    <div className={classes.panelTitleAndIcon}>
      {icon}
      <Typography
        variant="h6"
        component="h2"
        className={classes.panelTitleText}
      >
        {text}
      </Typography>
    </div>
  )
}

export const PanelTitleBar: FC = (props) => {
  const classes = useStyles()
  const { pathname } = useLocation()
  const panelHeading = pathname.split('/')[1] || 'Languages of NYC'
  const panelDispatch = usePanelDispatch()

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    panelDispatch({ type: 'TOGGLE_SEARCH_TABS' })
  }

  useEffect(() => {
    panelDispatch({ type: 'TOGGLE_SEARCH_TABS', payload: false })
  }, [panelDispatch, pathname])

  const RightSideBtns = (
    <div className={classes.rightSideBtns}>
      <Route path="/Explore">
        <Tooltip title="Toggle search menu">
          <IconButton
            size="small"
            aria-label="toggle search menu"
            color="inherit"
            onClick={handleClick}
          >
            <GoSearch />
          </IconButton>
        </Tooltip>
      </Route>
      <Tooltip title="Close panel">
        <IconButton
          size="small"
          aria-label="panel close"
          color="inherit"
          onClick={() =>
            panelDispatch({ type: 'TOGGLE_MAIN_PANEL', payload: false })
          }
        >
          <MdClose />
        </IconButton>
      </Tooltip>
    </div>
  )

  // WISHLIST: add maximize btn on mobile
  // WISHLIST: MAKE AUTO-HIDE WORK 😞
  return (
    <HideOnScroll {...props}>
      <AppBar className={classes.root}>
        <Toolbar variant="dense" className={classes.toolbar}>
          <Switch>
            <Route path="/" exact>
              {/* Flex spacer */}
              <div />
              <PanelTitle text={panelHeading} />
            </Route>
            <Route path="/:anything" exact>
              <Tooltip title="Go to Home panel">
                <IconButton
                  size="small"
                  aria-label="go home"
                  color="inherit"
                  to="/"
                  component={RouterLink}
                >
                  {icons.Home}
                </IconButton>
              </Tooltip>
              <PanelTitle text={panelHeading} icon={icons[panelHeading]} />
            </Route>
            <Route>
              <SplitCrumbs />
            </Route>
          </Switch>
          {RightSideBtns}
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  )
}

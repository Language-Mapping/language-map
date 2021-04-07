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

import { usePanelDispatch } from 'components/panels'
import { icons } from 'components/config'
import { routes } from 'components/config/api'
import { pluralize } from 'components/explore/utils'
import { SplitCrumbs } from './SplitCrumbs'

type StyleProps = { hide?: boolean }

const topCornersRadius = 4 // same as bottom left/right in nav bar
const borderTopLeftRadius = topCornersRadius
const borderTopRightRadius = topCornersRadius

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      borderTopLeftRadius,
      borderTopRightRadius,
      transition: '300ms all',
      transform: (props: StyleProps) =>
        props.hide ? 'translateY(-40px)' : 'translateY(0)',
      opacity: (props: StyleProps) => (props.hide ? 0 : 1),
      maxHeight: (props: StyleProps) => (props.hide ? 0 : 48),
      zIndex: (props: StyleProps) => (props.hide ? -1 : 1),
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
      [theme.breakpoints.down('sm')]: {
        fontSize: '1.25rem',
      },
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

// TODO: move this and the big Routes thing into new component
const PanelTitle: FC<PanelTitleProps> = (props) => {
  const { text, icon } = props
  const classes = useStyles({})

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

const LinkToHomeBtn: FC = (props) => {
  return (
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
  )
}

const PanelTitleRoutes: FC<{ panelTitle: string }> = (props) => {
  const { panelTitle } = props

  return (
    <Switch>
      <Route path="/" exact>
        {/* Flex spacer */}
        <div />
        <PanelTitle text="Languages of NYC" />
      </Route>
      <Route path={routes.none}>
        <PanelTitle text="No community selected" />
      </Route>
      <Route path={routes.table}>
        <PanelTitle text=" " />
      </Route>
      <Route
        path={['/Explore/:field/:value/:language/:id', routes.details]}
        exact
      >
        <PanelTitle text="Community Profile" icon={icons.CommunityProfile} />
      </Route>
      <Route
        path={[
          '/Explore/:field/:value/:language',
          '/Explore/Language/:language',
        ]}
        exact
      >
        <PanelTitle text="Language Profile" icon={icons.Language} />
      </Route>
      <Route path="/Explore/:field" exact>
        <PanelTitle text={pluralize(panelTitle)} icon={icons[panelTitle]} />
      </Route>
      <Route path="/Explore/:field/:value" exact>
        <PanelTitle text={panelTitle} icon={icons[panelTitle]} />
      </Route>
      <Route path="/Census">
        {/* Census just needs panel heading override */}
        <LinkToHomeBtn />
        <PanelTitle text="Census Language Data" icon={icons[panelTitle]} />
      </Route>
      <Route path="/:level1" exact>
        {/* Home btn on /TopLevelRoutes looks balanced on left */}
        <LinkToHomeBtn />
        <PanelTitle text={panelTitle} icon={icons[panelTitle]} />
      </Route>
    </Switch>
  )
}

export const PanelTitleBar: FC<{ hide: boolean }> = (props) => {
  const { hide } = props
  const classes = useStyles({ hide })
  const { pathname } = useLocation()
  // Lil' gross, but use Level2 route name first, otherwise Level1
  const panelTitle = pathname.split('/')[2] || pathname.split('/')[1]
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
  return (
    <AppBar className={classes.root} position="sticky">
      <Toolbar variant="dense" className={classes.toolbar}>
        <Switch>
          {/* Census can just have home btn */}
          <Route path={routes.local} />
          <Route path={['/', '/:level1']} exact />
          <Route>
            <SplitCrumbs />
          </Route>
        </Switch>
        <PanelTitleRoutes panelTitle={panelTitle} />
        {RightSideBtns}
      </Toolbar>
    </AppBar>
  )
}

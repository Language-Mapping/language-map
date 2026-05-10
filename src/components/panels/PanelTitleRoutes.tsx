import React, { FC } from 'react'
import { Route, Routes, Link as RouterLink } from 'react-router-dom'
import { Theme } from '@mui/material/styles'
import makeStyles from '@mui/styles/makeStyles'
import createStyles from '@mui/styles/createStyles'
import { IconButton, Typography, Tooltip, Hidden } from '@mui/material'

import { icons } from 'components/config'
import { routes } from 'components/config/api'
import { pluralize } from 'components/explore/utils'
import { Logo } from 'components/generic'

type PanelTitleProps = {
  text: React.ReactNode
  icon?: React.ReactNode
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      alignItems: 'center',
      display: 'flex',
      '& > svg': {
        color: theme.palette.text.disabled,
        marginRight: 6,
      },
    },
    logoWrap: {
      fontSize: '0.65rem',
      marginLeft: 'auto',
      marginRight: 'auto',
      display: 'flex',
      alignItems: 'center',
    },
    panelTitleText: {
      fontSize: '1.5rem',
      [theme.breakpoints.only('xs')]: {
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

const PanelTitle: FC<PanelTitleProps> = (props) => {
  const { text, icon } = props
  const classes = useStyles()

  return (
    <div className={classes.root}>
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
    <Tooltip title="Search & Display Options">
      <IconButton
        size="small"
        aria-label="go home"
        color="inherit"
        to="/"
        component={RouterLink}
      >
        {icons.HomeLink}
      </IconButton>
    </Tooltip>
  )
}

export const PanelTitleRoutes: FC<{ panelTitle: string }> = (props) => {
  const { panelTitle } = props
  const classes = useStyles()

  const homeIntro = (
    <>
      <div style={{ minWidth: '1.5rem' }} />
      <Hidden mdDown>
        <PanelTitle text="Search and Display Sites" icon={icons.Home} />
      </Hidden>
      <Hidden mdUp>
        <div className={classes.logoWrap}>
          <Logo darkTheme />
        </div>
      </Hidden>
    </>
  )

  const siteDetails = (
    <PanelTitle text="Site Details" icon={icons.SiteDetails} />
  )

  const languageTitle = <PanelTitle text="Language" icon={icons.Language} />

  const censusBlock = (
    <>
      <LinkToHomeBtn />
      <PanelTitle text="Census Language Data" icon={icons[panelTitle]} />
    </>
  )

  const exploreBlock = (
    <>
      <LinkToHomeBtn />
      <PanelTitle text="Explore ELA Data" icon={icons[panelTitle]} />
    </>
  )

  const topLevelBlock = (
    <>
      <LinkToHomeBtn />
      <PanelTitle text={panelTitle} icon={icons[panelTitle]} />
    </>
  )

  // TODO: add small logo to left side of bar
  return (
    <Routes>
      <Route path="/" element={homeIntro} />
      <Route
        path={routes.none}
        element={<PanelTitle text="No Site Selected" />}
      />
      <Route path={`${routes.data}/*`} element={<PanelTitle text=" " />} />
      <Route
        path="/Explore/:field/:value/:language/:id"
        element={siteDetails}
      />
      <Route path={routes.details} element={siteDetails} />
      <Route path="/Explore/:field/:value/:language" element={languageTitle} />
      <Route path={routes.languageInstance} element={languageTitle} />
      <Route
        path="/Explore/:field"
        element={
          <PanelTitle text={pluralize(panelTitle)} icon={icons[panelTitle]} />
        }
      />
      <Route
        path="/Explore/:field/:value"
        element={<PanelTitle text={panelTitle} icon={icons[panelTitle]} />}
      />
      <Route path="/Census/*" element={censusBlock} />
      <Route path={routes.explore} element={exploreBlock} />
      <Route
        path={routes.feedback}
        element={
          <PanelTitle text="Contact & Feedback" icon={icons[panelTitle]} />
        }
      />
      <Route path="/:level1" element={topLevelBlock} />
      <Route
        path={`${routes.info}/*`}
        element={<PanelTitle text={panelTitle} icon={icons[panelTitle]} />}
      />
    </Routes>
  )
}

import React, { FC, useState } from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import {
  makeStyles,
  Theme,
  createStyles,
  useTheme,
} from '@material-ui/core/styles'
import { Button, ButtonGroup, Popover, useMediaQuery } from '@material-ui/core'
import { MdArrowDropDown } from 'react-icons/md'
import { TiArrowBack } from 'react-icons/ti'

import { TimelineCrumbs } from './TimelineCrumbs'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      maxHeight: 350,
      minWidth: 275,
      overflowY: 'auto',
    },
  })
)

// TODO: rename these ridic functions and files for crying out loud
// TODO: use legit aria stuff
export const SplitCrumbs: FC = () => {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const anchorRef = React.useRef<HTMLDivElement>(null)
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null)
  // GROSS: but otherwise mobile or desktop sucks. Pick one.
  const theme = useTheme()
  const lilGuy = useMediaQuery(theme.breakpoints.only('xs'))

  // Path stuff
  const loc = useLocation<{ pathname: string }>()
  const { pathname = '/' } = loc
  const pathChunks = pathname.split('/')
  const notHome = pathChunks.slice(1) // exclude Home
  const backLink = pathChunks.slice(0, -1).join('/') || '/'

  const handleClose = () => {
    setAnchorEl(null)
    setOpen(false)
  }

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  const NavCrumbs = (
    <ButtonGroup
      size="small"
      variant="contained"
      color="secondary"
      ref={anchorRef}
      aria-label="split button"
    >
      <Button to={backLink} component={RouterLink} startIcon={<TiArrowBack />}>
        Back
      </Button>
      <Button
        aria-controls={open ? 'split-button-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-label="choose a parent path"
        aria-haspopup="menu"
        onClick={handleToggle}
      >
        <MdArrowDropDown />
      </Button>
    </ButtonGroup>
  )

  return (
    <>
      {NavCrumbs}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        PaperProps={{ className: classes.paper, elevation: 12 }}
        // GOOD ON MOBILE, need to adjust for desk:
        // anchorOrigin={{ vertical: 'center', horizontal: 'left' }}
        // transformOrigin={{ vertical: 'center', horizontal: 'left' }}
        anchorOrigin={{
          vertical: lilGuy ? 'center' : 'top',
          horizontal: 'left',
        }}
        transformOrigin={{ vertical: 'center', horizontal: 'left' }}
      >
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        <TimelineCrumbs pathChunks={notHome} />
        {/* TODO: UGGGGHHHH ^^^^^ */}
      </Popover>
    </>
  )
}

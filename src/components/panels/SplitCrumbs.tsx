import React, { FC } from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { IconButton, Popover, Tooltip } from '@material-ui/core'
import { TiThList } from 'react-icons/ti'
import { BsArrow90DegUp } from 'react-icons/bs'

import { TimelineCrumbs } from './TimelineCrumbs'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      maxHeight: 350,
      minWidth: 200,
      overflowY: 'auto',
    },
    leftSideBtns: {
      '& > * + *': {
        marginLeft: 4,
      },
    },
  })
)

// TODO: rename these ridic functions and files for crying out loud
// TODO: use legit aria stuff
export const SplitCrumbs: FC = () => {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)

  // Path stuff
  const loc = useLocation<{ pathname: string }>()
  const { pathname = '/' } = loc
  const pathChunks = pathname.split('/')
  const notHome = pathChunks.slice(1) // exclude Home
  const backLink = pathChunks.slice(0, -1).join('/') || '/'

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'show-explore-nav' : undefined

  return (
    <div>
      <div className={classes.leftSideBtns}>
        <Tooltip title="Up one level">
          <IconButton
            size="small"
            to={backLink}
            component={RouterLink}
            aria-label="up"
          >
            <BsArrow90DegUp />
          </IconButton>
        </Tooltip>
        <Tooltip title="Explore nav menu">
          <IconButton
            aria-describedby={id}
            size="small"
            aria-label="explore nav"
            aria-haspopup="menu"
            onClick={handleClick}
          >
            <TiThList />
          </IconButton>
        </Tooltip>
      </div>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        PaperProps={{ className: classes.paper, elevation: 24 }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        <TimelineCrumbs pathChunks={notHome} />
        {/* TODO: UGGGGHHHH ^^^^^ */}
      </Popover>
    </div>
  )
}

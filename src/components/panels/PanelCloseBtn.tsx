import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { IconButton, Link } from '@material-ui/core'
import { FiChevronDown } from 'react-icons/fi'

type CloseProps = {
  onClick: () => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    panelCloseBtn: {
      position: 'absolute',
      right: '0.5em',
      top: '0.5rem',
    },
    panelClosePill: {
      position: 'sticky',
      height: 8,
      zIndex: 100,
      top: 0,
      justifyContent: 'center',
      display: 'inline-flex',
      marginBottom: 8,
    },
    innerPill: {
      width: 36,
      backgroundColor: theme.palette.text.primary,
      height: 4,
      borderRadius: 4,
    },
  })
)

export const CloseBtnPill: FC<CloseProps> = (props) => {
  const { onClick } = props
  const classes = useStyles()

  return (
    <Link
      href="#"
      onTouchMove={() => onClick()}
      onTouchStart={() => onClick()}
      className={classes.panelClosePill}
      role="button"
    >
      <div
        className={classes.innerPill}
        onTouchMove={() => onClick()}
        onTouchStart={() => onClick()}
      />
    </Link>
  )
}

export const CloseBtn: FC<CloseProps> = (props) => {
  const { onClick } = props
  const classes = useStyles()

  return (
    <IconButton
      edge="end"
      color="inherit"
      className={classes.panelCloseBtn}
      onClick={(e: React.MouseEvent) => {
        e.preventDefault()
        onClick()
      }}
    >
      <FiChevronDown />
    </IconButton>
  )
}

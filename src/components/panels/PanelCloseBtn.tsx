import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Link } from '@material-ui/core'
import { IoIosArrowDropdown } from 'react-icons/io'

type CloseProps = {
  onClick: () => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    RouteLocation: {
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    },
  })
)

export const CloseBtn: FC<CloseProps> = (props) => {
  const { onClick } = props
  const classes = useStyles()

  return (
    <Link
      color="inherit"
      href="#"
      className={classes.RouteLocation}
      onClick={(e: React.MouseEvent) => {
        e.preventDefault()
        onClick()
      }}
    >
      <IoIosArrowDropdown />
    </Link>
  )
}

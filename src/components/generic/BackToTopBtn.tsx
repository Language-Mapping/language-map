import React, { FC } from 'react'
import {
  createStyles,
  makeStyles,
  Theme,
  Fab,
  fade,
  Zoom,
} from '@material-ui/core'
import { FaArrowCircleUp } from 'react-icons/fa'
import { BOTTOM_NAV_HEIGHT } from 'components/nav/config'

type BackToTopBtnProps = {
  hide: boolean
  targetElemID: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'absolute',
      bottom: BOTTOM_NAV_HEIGHT + 8,
      right: '1.25rem',
      [theme.breakpoints.down('sm')]: {
        bottom: '1rem',
        right: '1rem',
      },
    },
    fab: {
      width: 36,
      height: 36,
      minHeight: 36,
      backgroundColor: fade(theme.palette.secondary.main, 0.75),
    },
  })
)

export const BackToTopBtn: FC<BackToTopBtnProps> = (props) => {
  const { targetElemID, hide } = props
  const classes = useStyles()

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const anchor = (
      (event.target as HTMLDivElement).ownerDocument || document
    ).querySelector(`#${targetElemID}`)

    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  return (
    <Zoom in={hide} timeout={300}>
      <div onClick={handleClick} role="presentation" className={classes.root}>
        <Fab
          color="secondary"
          size="small"
          aria-label="scroll back to top"
          className={classes.fab}
        >
          <FaArrowCircleUp />
        </Fab>
      </div>
    </Zoom>
  )
}

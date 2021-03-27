import React, { FC } from 'react'
import useScrollTrigger from '@material-ui/core/useScrollTrigger'
import { createStyles, makeStyles, Theme, Zoom, Fab } from '@material-ui/core'
import { FaArrowCircleUp } from 'react-icons/fa'

type TabPanelProps = {
  index: number
  value: number
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backToTopBtn: {
      position: 'fixed',
      bottom: theme.spacing(1),
      right: 175,
      zIndex: 5000,
    },
  })
)

export const BackToTopBtn: FC = (props) => {
  const classes = useStyles()
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
        <Fab color="secondary" size="small" aria-label="scroll back to top">
          <FaArrowCircleUp />
        </Fab>
      </div>
    </Zoom>
  )
}

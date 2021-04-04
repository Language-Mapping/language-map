import React, { FC } from 'react'
import { createStyles, makeStyles, Theme, Zoom, Fab } from '@material-ui/core'
import { FaArrowCircleUp } from 'react-icons/fa'

type BackToTopBtnProps = {
  hide: boolean
  targetElemID: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backToTopBtn: {
      position: 'absolute',
      bottom: '1rem',
      right: '1rem',
      zIndex: 5000,
    },
  })
)

export const BackToTopBtn: FC<BackToTopBtnProps> = (props) => {
  const { hide, targetElemID } = props
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
    <Zoom in={hide}>
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

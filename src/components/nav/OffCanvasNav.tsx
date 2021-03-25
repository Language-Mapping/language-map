import React, { FC, useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Drawer } from '@material-ui/core'

import { Nav } from 'components/nav'
import { SimpleDialog } from 'components/generic/modals'
import { ToggleOffCanvasNav } from './types'

type OffCanvasNavProps = {
  isOpen: boolean
  setIsOpen: React.Dispatch<boolean>
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    offCanvasNavRoot: {
      cursor: 'pointer',
    },
    offCanvasNavList: {
      width: 300,
    },
  })
)

export const OffCanvasNav: FC<OffCanvasNavProps> = (props) => {
  const { isOpen, setIsOpen } = props
  const [feedbackModalOpen, setFeedbackModalOpen] = useState<boolean>(false)
  const classes = useStyles()
  const iframeSrc =
    'https://docs.google.com/forms/d/e/1FAIpQLSe5VQ3rLOXett6xN_lUUqm5X88rb5NgWeF6bbObRX9Sconc2w/viewform?embedded=true'

  const closeIt = () => setIsOpen(!isOpen)

  const toggleDrawer: ToggleOffCanvasNav = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return null
    }

    setIsOpen(!isOpen)

    return null
  }

  // TODO: make the <nav> semantic. Well it already is but it's not visible
  // until the off-canvas is opened...
  return (
    <>
      <SimpleDialog
        open={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
      >
        <div style={{ height: '75vh' }}>
          <iframe
            src={iframeSrc}
            width={window && window.innerWidth <= 640 ? '100%' : 640}
            height="100%"
            frameBorder="0"
            marginHeight={0}
            marginWidth={0}
            title="Feedback and questions"
          >
            Loading…
          </iframe>
        </div>
      </SimpleDialog>
      <Drawer
        open={isOpen}
        onClose={toggleDrawer(false)}
        className={classes.offCanvasNavRoot}
      >
        <div
          role="presentation"
          onClick={closeIt}
          className={classes.offCanvasNavList}
        >
          <Nav />
        </div>
      </Drawer>
    </>
  )
}

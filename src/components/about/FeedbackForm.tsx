import React, { FC } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'absolute',
      top: '1rem',
      right: '1rem',
      left: '1rem',
      bottom: '1rem',
    },
  })
)

const DOCS_FORM_SRC =
  'https://docs.google.com/forms/d/e/1FAIpQLSe5VQ3rLOXett6xN_lUUqm5X88rb5NgWeF6bbObRX9Sconc2w/viewform?embedded=true'

export const FeedbackForm: FC = (props) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <iframe
        src={DOCS_FORM_SRC}
        width="100%"
        height="100%"
        frameBorder="0"
        marginHeight={0}
        marginWidth={0}
        title="Feedback and questions"
      >
        Loading…
      </iframe>
    </div>
  )
}

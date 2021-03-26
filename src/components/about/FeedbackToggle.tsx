import React, { FC, useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Button } from '@material-ui/core'

import { FeedbackModal } from 'components/about'
import { Explanation } from 'components/generic'
import { icons } from 'components/config'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      borderTop: `solid 1px ${theme.palette.divider}`,
      marginTop: '1rem',
      paddingTop: '0.5rem',
    },
  })
)

export const FeedbackToggle: FC<{ language?: string }> = (props) => {
  const { language } = props
  const classes = useStyles()
  const [feedbackModalOpen, setFeedbackModalOpen] = useState<boolean>(false)

  return (
    <div className={classes.root}>
      {language ? (
        <Explanation>
          Note that <i>{language}</i> may be spoken throughout the New York area
          — this is just one significant location.
        </Explanation>
      ) : null}
      <div
        style={{ textAlign: 'center', maxWidth: '85%', margin: '16px auto' }}
      >
        <Button
          onClick={() => setFeedbackModalOpen(true)}
          variant="outlined"
          color="secondary"
          size="small"
          startIcon={icons.Feedback}
        >
          Provide feedback
        </Button>
      </div>
      <FeedbackModal open={feedbackModalOpen} setOpen={setFeedbackModalOpen} />
    </div>
  )
}

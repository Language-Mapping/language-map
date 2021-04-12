import React, { FC } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

import { BasicExploreIntro } from 'components/explore'
import { UItextFromAirtable } from 'components/generic'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: '0 1.25rem',
      '& p': {
        textAlign: 'center',
        fontSize: '1.15rem',
        marginBottom: '0.75rem',
      },
      '& ul': {
        paddingLeft: '0.5rem',
        fontSize: '0.85rem',
        margin: '0.5rem 0',
      },
      '& header': {
        marginBottom: '0.25rem',
      },
    },
  })
)

export const WaysToHelp: FC = (props) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <BasicExploreIntro
        introParagraph={
          <UItextFromAirtable id="call-to-action" rootElemType="p" />
        }
      />
    </div>
  )
}

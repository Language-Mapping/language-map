import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Link } from '@material-ui/core'
import { FaQuestionCircle } from 'react-icons/fa'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    glossaryTriggerRoot: {
      alignItems: 'center',
      color: theme.palette.info.main,
      display: 'flex',
      fontSize: 12,
      '& > svg': {
        marginRight: 4,
      },
    },
  })
)

export const GlossaryTrigger: FC = () => {
  const classes = useStyles()

  // TODO: a simple `<RouterLink to="/glossary?${loc.search}"` should do it
  return (
    <Link href="javascript;" className={classes.glossaryTriggerRoot}>
      <FaQuestionCircle />
      What do these mean?
    </Link>
  )
}

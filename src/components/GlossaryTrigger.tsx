import React, { FC } from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Link } from '@material-ui/core'
import { FaQuestionCircle } from 'react-icons/fa'

import { paths as routes } from 'components/config/routes'

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
  const loc = useLocation()

  return (
    <Link
      component={RouterLink}
      to={`${routes.glossary}${loc.search}`}
      className={classes.glossaryTriggerRoot}
    >
      <FaQuestionCircle />
    </Link>
  )
}

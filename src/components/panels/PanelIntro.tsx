import React, { FC, useContext } from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Button } from '@material-ui/core'
import { TiDocumentText, TiDocumentDelete } from 'react-icons/ti'
import { AiOutlineQuestionCircle } from 'react-icons/ai'

import { GlobalContext } from 'components'
import { paths as routes } from 'components/config/routes'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    panelIntroRoot: {
      alignItems: 'center',
      backgroundColor: theme.palette.background.paper,
      borderBottomColor: theme.palette.divider,
      borderBottomStyle: 'solid',
      borderBottomWidth: 1,
      display: 'grid',
      gridTemplateColumns: 'auto auto 1fr',
      justifyItems: 'flex-end',
      listStyle: 'none',
      margin: 0,
      marginBottom: '0.25rem',
      paddingLeft: 8,
      paddingRight: 8,
      position: 'sticky',
      top: 0,
      zIndex: 1,
      [theme.breakpoints.up('sm')]: {
        gridColumnGap: 8,
        paddingBottom: '0.25rem',
        paddingTop: '0.25rem',
        paddingLeft: 16,
        paddingRight: 16,
      },
      [theme.breakpoints.only('sm')]: {
        gridColumnGap: 12,
      },
      '& .MuiButton-startIcon': { marginRight: 4 },
    },
    introBtn: {
      textTransform: 'none',
      [theme.breakpoints.down('xs')]: { fontSize: '0.85em' },
    },
  })
)

export const PanelIntro: FC = () => {
  const { state } = useContext(GlobalContext)
  const classes = useStyles()
  const loc = useLocation()

  return (
    <ul className={classes.panelIntroRoot}>
      <li>
        <Button
          title="Data table of language communities"
          className={classes.introBtn}
          color="primary"
          component={RouterLink}
          size="small"
          startIcon={<TiDocumentText />}
          to={routes.table + loc.search}
        >
          Data Table & Filters
        </Button>
      </li>
      <li>
        <Button
          title="Clear currently selected community"
          className={classes.introBtn}
          color="primary"
          component={RouterLink}
          disabled={state.selFeatAttribs === null}
          size="small"
          startIcon={<TiDocumentDelete />}
          to={loc.pathname}
        >
          Clear selected
        </Button>
      </li>
      <li>
        <Button
          title="Glossary of common terms"
          className={classes.introBtn}
          color="primary"
          component={RouterLink}
          size="small"
          startIcon={<AiOutlineQuestionCircle />}
          to={routes.glossary + loc.search}
        >
          Help
        </Button>
      </li>
    </ul>
  )
}

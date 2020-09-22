import React, { FC, useContext } from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Button, Badge, IconButton } from '@material-ui/core'
import { RiFilterOffFill } from 'react-icons/ri'
import { TiDocumentDelete, TiThList } from 'react-icons/ti'
import { AiOutlineQuestionCircle } from 'react-icons/ai'

import { paths as routes } from 'components/config/routes'
import { GlobalContext } from 'components'

type PanelIntroProps = { openTable: () => void }

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    panelIntroRoot: {
      alignItems: 'center',
      borderBottomColor: theme.palette.divider,
      borderBottomStyle: 'solid',
      borderBottomWidth: 1,
      display: 'flex',
      listStyle: 'none',
      margin: 0,
      padding: '0 0.5em',
      position: 'sticky',
      top: 0,
      justifyContent: 'space-between',
      zIndex: 1,
      [theme.breakpoints.up('sm')]: {
        padding: '0.5em 1em',
      },
      [theme.breakpoints.between('sm', 'md')]: {
        justifyContent: 'space-around',
      },
      [theme.breakpoints.up('xl')]: {
        justifyContent: 'space-around',
      },
      '& .MuiButton-startIcon': { marginRight: 4 },
    },
    introBtn: {
      [theme.breakpoints.down('xs')]: { fontSize: '0.85em' },
    },
    helpBtn: {
      position: 'absolute',
      top: 'calc(100% + 0.5em)',
      right: '0.5em',
      [theme.breakpoints.up('sm')]: {
        right: '1em',
      },
    },
  })
)

export const PanelIntro: FC<PanelIntroProps> = (props) => {
  const { openTable } = props
  const { state, dispatch } = useContext(GlobalContext)
  const classes = useStyles()
  const loc = useLocation()

  const handleTableBtnClick = (): void => openTable()

  return (
    <ul className={classes.panelIntroRoot}>
      <li>
        <Button
          title="Data table of language communities"
          className={classes.introBtn}
          color="primary"
          size="small"
          startIcon={
            <Badge
              variant="dot"
              badgeContent=""
              color="secondary"
              overlap="circle"
              anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
              invisible={state.langFeatsLenCache === state.langFeatures.length}
            >
              <TiThList />
            </Badge>
          }
          onClick={handleTableBtnClick}
        >
          Data & filters
        </Button>
      </li>
      <li>
        <Button
          title="Clear table filters"
          className={classes.introBtn}
          color="primary"
          disabled={state.clearFilters === 0}
          size="small"
          startIcon={<RiFilterOffFill />}
          // TODO: fix, obviously:
          onClick={() => dispatch({ type: 'CLEAR_FILTERS', payload: 555 })}
        >
          Clear filters
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
      <li className={classes.helpBtn}>
        <IconButton
          title="Help and glossary of common terms"
          component={RouterLink}
          size="small"
          to={routes.help + loc.search}
        >
          <AiOutlineQuestionCircle />
        </IconButton>
      </li>
    </ul>
  )
}

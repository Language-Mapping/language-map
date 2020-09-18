import React, { FC, useContext } from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Button, Badge, IconButton } from '@material-ui/core'
import { TiDocumentText, TiDocumentDelete } from 'react-icons/ti'
import { AiOutlineQuestionCircle } from 'react-icons/ai'

import { GlobalContext } from 'components'
import { paths as routes } from 'components/config/routes'

type PanelIntroProps = { openTable: () => void }

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    panelIntroRoot: {
      alignItems: 'center',
      borderBottomColor: theme.palette.divider,
      borderBottomStyle: 'solid',
      borderBottomWidth: 1,
      display: 'grid',
      gridTemplateColumns: 'auto auto',
      justifyContent: 'space-around',
      listStyle: 'none',
      margin: 0,
      marginBottom: '0.25rem',
      paddingLeft: 8,
      paddingRight: 8,
      position: 'sticky',
      top: 0,
      zIndex: 1,
      [theme.breakpoints.up('sm')]: {
        paddingBottom: '0.25rem',
        paddingTop: '0.25rem',
        paddingLeft: 12,
        paddingRight: 12,
      },
      '& .MuiButton-startIcon': { marginRight: 4 },
    },
    introBtn: {
      textTransform: 'none',
      [theme.breakpoints.down('xs')]: { fontSize: '0.85em' },
    },
    helpBtn: {
      position: 'absolute',
      top: '125%',
      right: 8,
      [theme.breakpoints.between('md', 'lg')]: { right: 14 },
    },
  })
)

export const PanelIntro: FC<PanelIntroProps> = (props) => {
  const { openTable } = props
  const { state } = useContext(GlobalContext)
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
              badgeContent=" "
              color="secondary"
              overlap="circle"
              anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
              invisible={state.langFeatsLenCache === state.langFeatures.length}
            >
              <TiDocumentText />
            </Badge>
          }
          onClick={handleTableBtnClick}
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
        <IconButton
          title="Help and glossary of common terms"
          className={classes.helpBtn}
          color="primary"
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

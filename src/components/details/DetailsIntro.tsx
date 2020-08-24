import React, { FC, useContext } from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Button } from '@material-ui/core'
import { fade } from '@material-ui/core/styles/colorManipulator'
import { TiDocumentText, TiDocumentDelete } from 'react-icons/ti'
import { FaQuestionCircle } from 'react-icons/fa'

import { RouteLocation } from 'components/map/types'
import { GlobalContext } from 'components'

const GLOSSARY_PATH: RouteLocation = '/glossary'
const DATA_TABLE_PATHNAME: RouteLocation = '/table'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    detailsIntroRoot: {
      alignItems: 'center',
      borderBottomColor: fade(theme.palette.primary.light, 0.35),
      borderBottomStyle: 'solid',
      borderBottomWidth: 1,
      display: 'flex',
      justifyContent: 'space-around',
      listStyle: 'none',
      marginLeft: 0,
      marginRight: 0,
      marginTop: '-0.5rem', // cheap way to override panel padding
      paddingBottom: '0.25rem',
      paddingLeft: 0,
      paddingRight: 0,
      '& [role="button"], button': {
        color: theme.palette.primary.light,
        flex: 1,
      },
      '& .MuiButton-startIcon': {
        marginRight: 4,
      },
    },
    hideOnMobile: {
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },
  })
)

export const DetailsIntro: FC = () => {
  const { dispatch } = useContext(GlobalContext)
  const classes = useStyles()
  const loc = useLocation()

  return (
    <ul className={classes.detailsIntroRoot}>
      <li>
        <Button
          title="Data table of language communities"
          component={RouterLink}
          size="small"
          startIcon={<TiDocumentText />}
          to={DATA_TABLE_PATHNAME}
        >
          <span className={classes.hideOnMobile}>Show&nbsp;</span>All data
        </Button>
      </li>
      <li>
        <Button
          title="Clear currently selected community"
          size="small"
          startIcon={<TiDocumentDelete />}
          onClick={() =>
            dispatch({ type: 'SET_SEL_FEAT_ATTRIBS', payload: null })
          }
        >
          Clear<span className={classes.hideOnMobile}>&nbsp;selection</span>
        </Button>
      </li>
      <li>
        <Button
          title="Explanation and definitions of info"
          component={RouterLink}
          size="small"
          startIcon={<FaQuestionCircle />}
          to={`${GLOSSARY_PATH}${loc.search}`}
        >
          <span className={classes.hideOnMobile}>View&nbsp;</span>Guide
        </Button>
      </li>
    </ul>
  )
}

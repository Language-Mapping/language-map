import React, { FC, useContext } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Button } from '@material-ui/core'
import { TiDocumentText, TiDocumentDelete } from 'react-icons/ti'

import { RouteLocation } from 'components/map/types'
import { GlobalContext } from 'components'

const DATA_TABLE_PATHNAME: RouteLocation = '/table'
const DETAILS_PATH: RouteLocation = '/details'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    detailsIntroRoot: {
      alignItems: 'center',
      backgroundColor: theme.palette.background.paper,
      borderBottomColor: theme.palette.divider,
      borderBottomStyle: 'solid',
      borderBottomWidth: 1,
      display: 'flex',
      justifyContent: 'space-around',
      listStyle: 'none',
      margin: 0,
      marginBottom: '0.25rem',
      paddingLeft: 0,
      paddingRight: 0,
      position: 'sticky',
      top: 0,
      zIndex: 1,
      [theme.breakpoints.up('sm')]: {
        paddingBottom: '0.25rem',
        paddingTop: '0.25rem',
      },
      '& .MuiButton-startIcon': {
        marginRight: 4,
      },
    },
    introBtn: {
      flex: 1,
      textTransform: 'none',
    },
  })
)

export const DetailsIntro: FC = () => {
  const { state } = useContext(GlobalContext)
  const classes = useStyles()

  return (
    <ul className={classes.detailsIntroRoot}>
      <li>
        <Button
          title="Data table of language communities"
          className={classes.introBtn}
          color="primary"
          component={RouterLink}
          size="small"
          startIcon={<TiDocumentText />}
          to={DATA_TABLE_PATHNAME}
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
          to={DETAILS_PATH}
        >
          Clear selected
        </Button>
      </li>
    </ul>
  )
}

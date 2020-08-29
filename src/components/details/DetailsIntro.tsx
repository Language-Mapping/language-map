import React, { FC, useContext } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Button } from '@material-ui/core'
import { fade } from '@material-ui/core/styles/colorManipulator'
import { TiDocumentText, TiDocumentDelete } from 'react-icons/ti'

import { RouteLocation } from 'components/map/types'
import { GlobalContext } from 'components'

const DATA_TABLE_PATHNAME: RouteLocation = '/table'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    detailsIntroRoot: {
      alignItems: 'center',
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
      [theme.breakpoints.up('sm')]: {
        paddingBottom: '0.25rem',
        paddingTop: '0.25rem',
      },
      '& [role="button"], button': {
        color: fade(theme.palette.primary.light, 0.85),
        flex: 1,
        textTransform: 'none',
      },
      '& .MuiButton-startIcon': {
        marginRight: 4,
      },
    },
  })
)

export const DetailsIntro: FC = () => {
  const { state, dispatch } = useContext(GlobalContext)
  const classes = useStyles()

  return (
    <ul className={classes.detailsIntroRoot}>
      <li>
        <Button
          title="Data table of language communities"
          component={RouterLink}
          size="small"
          color="default"
          startIcon={<TiDocumentText />}
          to={DATA_TABLE_PATHNAME}
        >
          Data Table & Filters
        </Button>
      </li>
      <li>
        <Button
          title="Clear currently selected community"
          size="small"
          color="default"
          startIcon={<TiDocumentDelete />}
          disabled={!state.selFeatAttribs}
          onClick={() =>
            dispatch({ type: 'SET_SEL_FEAT_ATTRIBS', payload: null })
          }
        >
          Clear selected
        </Button>
      </li>
    </ul>
  )
}

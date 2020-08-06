import React, { FC, useContext } from 'react'
import { useLocation } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Link, Typography, Divider } from '@material-ui/core'

import { GlobalContext, LoadingIndicator } from 'components'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    detailsPanelRoot: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
    intro: {
      textAlign: 'center',
      paddingBottom: theme.spacing(1),
    },
    subheading: {
      marginBottom: theme.spacing(1),
    },
    description: {
      marginTop: theme.spacing(1),
      fontSize: theme.typography.caption.fontSize,
    },
  })
)

export const DetailsPanel: FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getLocation = useLocation() // must exist for routing to work?
  const classes = useStyles()
  const { state, dispatch } = useContext(GlobalContext)

  // Shaky check to see if features have loaded and are stored globally
  // TODO: use MB's loading events to set this instead
  if (!state.langFeaturesCached.length) {
    return <LoadingIndicator />
  }

  const { selFeatAttrbs } = state

  // No sel feat details
  if (!selFeatAttrbs) {
    return (
      <p>
        Click a language community in the map or the{' '}
        <Link
          href="javascript;"
          onClick={(e: React.MouseEvent) => {
            e.preventDefault()
            dispatch({ type: 'SET_ACTIVE_PANEL_INDEX', payload: 1 })
          }}
        >
          data table
        </Link>{' '}
        to learn more.
      </p>
    )
  }

  // TODO: deal with this
  // if (!Object.keys(state.selFeatAttrbs).length) {
  //   return (
  //     <p>
  //       Feature with id <b>{parsed.id}</b> not found.
  //     </p>
  //   )
  // }

  return (
    <div className={classes.detailsPanelRoot}>
      <Link
        href="javascript;"
        onClick={(e: React.MouseEvent) => {
          e.preventDefault()
          dispatch({ type: 'SET_ACTIVE_PANEL_INDEX', payload: 1 })
        }}
      >
        {`<`} Back to results
      </Link>
      <div className={classes.intro}>
        <Typography component="h3" variant="h4">
          {selFeatAttrbs.Endonym}
        </Typography>
        {selFeatAttrbs.Endonym !== selFeatAttrbs.Language && (
          <Typography variant="caption" className={classes.subheading}>
            {`(${selFeatAttrbs.Language})`}
          </Typography>
        )}
        <small>
          <i>{selFeatAttrbs.Neighborhood}</i>
        </small>
      </div>
      <Divider />
      <Typography variant="body2" className={classes.description}>
        {selFeatAttrbs.Description}
      </Typography>
    </div>
  )
}

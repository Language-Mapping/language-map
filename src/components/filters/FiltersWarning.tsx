import React, { FC, useContext } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography, Link } from '@material-ui/core'

import { GlobalContext } from 'components'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      alignItems: 'center',
      color: theme.palette.text.secondary,
      display: 'flex',
      fontSize: '0.65em',
      fontStyle: 'italic',
      lineHeight: 1.2,
      marginBottom: '0.5em',
    },
    fabBadge: {
      backgroundColor: theme.palette.warning.light,
      height: '0.5em',
      width: '0.5em',
      flexShrink: 0,
      marginRight: '0.4em',
      borderRadius: '100%',
    },
  })
)

// Let user know that they are searching filtered data
export const FiltersWarning: FC = () => {
  const classes = useStyles()
  const { state, dispatch } = useContext(GlobalContext)

  if (state.langFeatsLenCache === state.langFeatures.length) return null

  const BadgeDot = <span className={classes.fabBadge} />

  const ClearFilters = (
    <Link
      title="Clear table filters"
      href="#"
      color="primary"
      onClick={(e: React.MouseEvent) => {
        e.preventDefault()

        dispatch({ type: 'CLEAR_FILTERS', payload: 555 }) // TODO: fix, obvi
      }}
    >
      clear
    </Link>
  )

  const TableLink = (
    <Link to="/table" component={RouterLink}>
      view
    </Link>
  )

  return (
    <Typography className={classes.root} component="div">
      {BadgeDot}
      <p>
        Current filters have been applied and may affect results. You can{' '}
        {ClearFilters} or {TableLink} them if needed.
      </p>
    </Typography>
  )
}

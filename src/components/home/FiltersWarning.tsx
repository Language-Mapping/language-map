import React, { FC, useContext } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Link } from '@material-ui/core'

import { GlobalContext } from 'components/context'
import { Explanation } from 'components/generic'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    inner: {
      alignItems: 'baseline',
      display: 'flex',
      fontStyle: 'italic',
      marginBottom: '1rem',
    },
    badgeDot: {
      backgroundColor: theme.palette.warning.light,
      borderRadius: '100%',
      flexShrink: 0,
      height: 6,
      marginRight: '0.4em',
      width: 6,
    },
  })
)

// Let user know that they are searching filtered data
export const FiltersWarning: FC = () => {
  const classes = useStyles()
  const { state, dispatch } = useContext(GlobalContext)

  if (state.langFeatsLenCache === state.langFeatures.length) return null

  const BadgeDot = <div className={classes.badgeDot} />

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
    <Explanation className={classes.inner}>
      {BadgeDot}
      <div>
        Current filters have been applied and may affect results. You can{' '}
        {ClearFilters} or {TableLink} them if needed.
      </div>
    </Explanation>
  )
}

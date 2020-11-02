import React, { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Paper } from '@material-ui/core'

import { paths as routes } from 'components/config/routes'
import { LangRecordSchema } from '../../context/types'

type ImportantCols = Pick<
  LangRecordSchema,
  'Language' | 'Countries' | 'World Region'
>
type ColumnKeys = keyof ImportantCols

// TODO: simplify all this to just need routeValues and a country flag
type MoreLikeThis = {
  goodies: {
    [key in keyof ImportantCols]: React.ReactNode
  }
  routeValues: {
    [key in keyof ImportantCols]: React.ReactNode
  }
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      fontSize: '0.75rem',
      justifyContent: 'center',
      flexWrap: 'wrap',
      margin: '0.5em 0',
      '& > * + *': {
        marginLeft: '0.5em',
      },
    },
    chip: {
      display: 'inline-flex',
      alignItems: 'center',
      borderRadius: 5,
      backgroundColor: theme.palette.secondary.main,
      padding: '0.25em 0.5em',
      marginBottom: '0.25em', // otherwise crowded when wrapped
      '& > :first-child': {
        marginRight: '0.35em',
      },
      '& .country-flag': {
        // Ensure outer white shapes are seen
        outline: `solid 1px ${theme.palette.divider}`,
        height: 12,
      },
    },
  })
)

const CustomChip: FC<{ to: string }> = (props) => {
  const classes = useStyles()
  const { children, to } = props

  return (
    <Paper
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      component={RouterLink}
      to={to}
      elevation={2}
      className={classes.chip}
    >
      {children}
    </Paper>
  )
}

export const MoreLikeThis: FC<MoreLikeThis> = (props) => {
  const { goodies, routeValues } = props
  const classes = useStyles()
  const items = ['Language', 'Countries', 'World Region'] as ColumnKeys[]

  return (
    <div className={classes.root}>
      {items.map((item) => (
        <CustomChip
          key={item}
          to={`${routes.grid}/${item}/${routeValues[item]}`}
        >
          {goodies[item]}
        </CustomChip>
      ))}
    </div>
  )
}

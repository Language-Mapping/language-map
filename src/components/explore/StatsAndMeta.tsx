import React, { FC } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

import { StatsAndMetaProps } from 'components/explore/types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'inline-flex',
      flexWrap: 'wrap',
      fontSize: '0.75rem',
      justifyContent: 'center',
      listStyle: 'none',
      margin: 0,
      padding: 0,
      '& > :not(:last-child)': {
        borderRight: `solid 1px ${theme.palette.text.secondary}`,
        marginRight: '0.4rem',
        paddingRight: '0.4rem',
      },
    },
  })
)

export const StatsAndMeta: FC<StatsAndMetaProps> = (props) => {
  const { data = {} } = props
  const classes = useStyles()

  return (
    <ul className={classes.root}>
      {data['Global Speaker Total'] && (
        <li>
          <b>Global speakers:</b>{' '}
          {data['Global Speaker Total'].toLocaleString()}
        </li>
      )}
      {data.Glottocode && (
        <li>
          <b>Glottocode:</b> {data.Glottocode}
        </li>
      )}
      {data['ISO 639-3'] && (
        <li>
          <b>ISO 639-3:</b> {data['ISO 639-3']}
        </li>
      )}
    </ul>
  )
}

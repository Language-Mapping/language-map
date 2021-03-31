import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { SwatchOnly } from 'components/legend'
import { useParams, useRouteMatch } from 'react-router-dom'
import { RouteMatch, TonsWithAddl } from './types'
import { getUniqueInstances } from './utils'
import { CustomCard } from './CustomCard'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    // TODO: masonry someday:
    // www.smashingmagazine.com/2017/09/css-grid-gotchas-stumbling-blocks/
    root: {
      display: 'grid',
      gridRowGap: '0.75rem',
      gridColumnGap: '0.5em',
      gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
      margin: '1rem 0',
      [theme.breakpoints.up('sm')]: {
        gridColumnGap: '0.75rem',
      },
    },
  })
)

export const CardListWrap: FC = (props) => {
  const { children } = props
  const classes = useStyles()

  return <div className={classes.root}>{children}</div>
}

// TODO: https://react-window.now.sh/#/examples/list/fixed-size
// Simple grid wrapper designed for Card children
export const CardList: FC<{ data: TonsWithAddl[] }> = (props) => {
  const { data } = props
  const classes = useStyles()
  const { field, value } = useParams<RouteMatch & { value: string }>()
  const { url } = useRouteMatch()

  return (
    <div className={classes.root}>
      {data.map((row) => {
        const uniqueInstances = getUniqueInstances(field, row, value)
        const nameOrLang = row.name || row.Language

        return (
          <CustomCard
            key={nameOrLang}
            intro={nameOrLang}
            title={row.Endonym}
            uniqueInstances={uniqueInstances}
            url={`${url}/${nameOrLang}`}
            // TODO: use and refactor SwatchOrFlagOrIcon for icon prop
            icon={
              <>
                {row['icon-color'] && (
                  <SwatchOnly backgroundColor={row['icon-color']} />
                )}
                {row.src_image && (
                  <img
                    style={{ height: '0.8em', marginRight: '0.25em' }}
                    src={row.src_image[0].url}
                    alt={nameOrLang}
                  />
                )}
              </>
            }
          />
        )
      })}
    </div>
  )
}

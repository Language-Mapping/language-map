import React, { FC } from 'react'
import { useParams, useRouteMatch } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { ColoredCircle } from 'components/generic/icons-and-swatches'
import { RouteMatch, TonsWithAddl } from './types'
import { getUniqueInstances } from './utils'
import { CustomCard } from './CustomCard'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    // TODO: masonry someday:
    // www.smashingmagazine.com/2017/09/css-grid-gotchas-stumbling-blocks/
    root: {
      display: 'grid',
      gridColumnGap: '0.65rem',
      gridRowGap: '0.75rem',
      gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
      margin: '1rem 0',
      [theme.breakpoints.only('sm')]: {
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gridGap: '1.25rem',
      },
      [theme.breakpoints.up('xl')]: {
        gridGap: '1rem',
        gridTemplateColumns: 'repeat(auto-fill, minmax(45%, 1fr))',
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
  const useLangAsIntro = value || field === 'Language'

  return (
    <div className={classes.root}>
      {data.map((row, i) => {
        const uniqueInstances = getUniqueInstances(field, row, value)
        const nameOrLang = row.name || row.Language

        return (
          <CustomCard
            key={nameOrLang}
            noAnimate={i > 25}
            intro={useLangAsIntro ? nameOrLang : ''}
            title={row.Endonym || row.name}
            uniqueInstances={uniqueInstances}
            url={`${url}/${nameOrLang}`}
            timeout={350 + i * 250}
            // TODO: use and refactor SwatchOrFlagOrIcon for icon prop
            icon={
              <>
                {row['icon-color'] && (
                  <ColoredCircle color={row['icon-color']} />
                )}
                {row.src_image && (
                  <img
                    style={{ height: '0.75rem', marginRight: '0.25em' }}
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

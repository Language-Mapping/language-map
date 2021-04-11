import React, { FC } from 'react'
import { useQuery } from 'react-query'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { LoadingIndicator } from 'components/generic/modals'
import { AboutPageProps, WpApiPageResponse } from './types'
import { createMarkup } from '../../utils'
import { defaultQueryFn } from './utils'

const NO_IMG_SHADOW_CLASSNAME = 'no-img-shadow'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& img': {
        height: 'auto',
        margin: '1rem auto',
        maxWidth: '100%',
        boxShadow: theme.shadows[8],
        // Prevent screenshots from getting lost in Paper bg if same color:
        // outline: 'solid 1px hsl(0deg 0% 40%)',
        [theme.breakpoints.down('xs')]: {
          margin: '0.5rem 0',
        },
      },
      '& figure': {
        margin: '1rem 0', // horiz. margin defaults to huge 40px in Chrome
        textAlign: 'center',
      },
      [`& .${NO_IMG_SHADOW_CLASSNAME} img`]: {
        boxShadow: 'none',
      },
    },
  })
)

export const AboutPageView: FC<AboutPageProps> = (props) => {
  const { queryKey, noImgShadow } = props
  const classes = useStyles()

  const { data, isLoading, error } = useQuery(queryKey, () =>
    defaultQueryFn<WpApiPageResponse>(queryKey)
  )

  if (isLoading) return <LoadingIndicator omitText />

  // TODO: wire up Sentry; aria; TS for error (`error.message` is a string)
  return (
    <div className={classes.root}>
      {error && (
        <>
          An error has occurred.{' '}
          <span role="img" aria-label="man shrugging emoji">
            🤷‍♂
          </span>
        </>
      )}
      <div
        className={noImgShadow ? NO_IMG_SHADOW_CLASSNAME : ''}
        dangerouslySetInnerHTML={createMarkup(data?.content.rendered || '')}
        id={`${queryKey}-content`}
      />
    </div>
  )
}

import React, { FC } from 'react'
import { Link as RouterLink, Route, Switch } from 'react-router-dom'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@material-ui/lab'

import { RouteableTableNames } from 'components/context/types'
import { icons } from 'components/config'

type TimelineCrumbsProps = {
  pathChunks: [string | RouteableTableNames]
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: '0 0.5rem 0 0',
      marginBottom: 0,
      '& .MuiTimelineItem-missingOppositeContent:before': {
        flex: 'none',
        padding: '0.5rem',
      },
    },
    timelineItem: {
      minHeight: 60,
    },
    wideEmptyIcon: {
      padding: 12,
    },
  })
)

export const TimelineCrumbs: FC<TimelineCrumbsProps> = (props) => {
  const classes = useStyles()
  const { pathChunks } = props

  return (
    <Timeline className={classes.root}>
      {[...pathChunks].reverse().map((chunk, i) => {
        const firstOne = i === 0
        const panelIcon =
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          icons[chunk]
        const to = `/${pathChunks.slice(0, pathChunks.length - i).join('/')}`
        const emptyIconClass = panelIcon ? '' : classes.wideEmptyIcon

        return (
          <TimelineItem
            key={chunk as string}
            classes={{ root: classes.timelineItem }}
          >
            <TimelineSeparator>
              <TimelineDot
                color="secondary"
                variant={firstOne ? 'outlined' : 'default'}
                className={emptyIconClass}
              >
                {panelIcon}
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              {firstOne ? (
                <b>
                  <Switch>
                    <Route path="/Explore/Language/:language/:instanceID" exact>
                      Community details
                    </Route>
                    <Route path="/Explore/Language/none">
                      No community selected
                    </Route>
                    <Route>{chunk}</Route>
                  </Switch>
                </b>
              ) : (
                <RouterLink to={to}>{chunk}</RouterLink>
              )}
            </TimelineContent>
          </TimelineItem>
        )
      })}
      {/* Always link to Home at bottom of timeline */}
      <TimelineItem classes={{ root: classes.timelineItem }}>
        <TimelineSeparator>
          <TimelineDot color="secondary">{icons.HomeLink}</TimelineDot>
        </TimelineSeparator>
        <TimelineContent>
          <RouterLink to="/">Home</RouterLink>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  )
}

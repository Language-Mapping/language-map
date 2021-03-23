import React, { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
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
import { exploreIcons } from 'components/explore'
import { navRoutes } from './config'

type TimelineCrumbsProps = {
  pathChunks: [string | RouteableTableNames]
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& .MuiTimelineItem-missingOppositeContent:before': {
        flex: 'none',
      },
      // TODO: rm when done:
      // '& .MuiTimelineContent-root': { alignSelf: 'center' },
    },
    timelineItem: {
      minHeight: 60,
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
          exploreIcons[chunk] || // TODO: UGGGGHHHH
          navRoutes.find(({ heading }) => {
            return heading === chunk
          })?.icon ||
          null
        const to = `/${pathChunks.slice(0, pathChunks.length - i).join('/')}`

        return (
          <TimelineItem
            key={chunk as string}
            classes={{ root: classes.timelineItem }}
          >
            <TimelineSeparator>
              <TimelineDot
                color="secondary"
                variant={firstOne ? 'outlined' : 'default'}
              >
                {panelIcon}
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              {firstOne ? (
                <b>{chunk}</b>
              ) : (
                <RouterLink to={to}>{chunk}</RouterLink>
              )}
            </TimelineContent>
          </TimelineItem>
        )
      })}
      <TimelineItem classes={{ root: classes.timelineItem }}>
        <TimelineSeparator>
          <TimelineDot color="secondary">
            {/* TODO: some kind of legit system for icons */}
            {navRoutes.find(({ heading }) => {
              return heading === 'Home'
            })?.icon || null}
          </TimelineDot>
        </TimelineSeparator>
        <TimelineContent>
          <RouterLink to="/">Home</RouterLink>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  )
}

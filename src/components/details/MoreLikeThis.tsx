import React, { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography, Chip, Avatar } from '@material-ui/core'

import { paths as routes } from 'components/config/routes'
import { LangRecordSchema } from '../../context/types'

type ImportantCols = Pick<
  LangRecordSchema,
  'Language' | 'World Region' | 'Status'
>
type ColumnKeys = keyof ImportantCols
type MoreLikeThis = {
  goodies: ImportantCols
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    list: {
      listStyle: 'none',
      fontSize: 10,
      padding: 0,
      display: 'flex',
      [theme.breakpoints.only('sm')]: {
        overflowX: 'scroll',
      },
      '& > * + *': {
        marginLeft: 4,
      },
    },
  })
)

export const MoreLikeThis: FC<MoreLikeThis> = (props) => {
  const { goodies } = props
  const classes = useStyles()
  const { root, list } = classes
  const items = ['Language', 'World Region', 'Status'] as ColumnKeys[]

  return (
    <div className={root}>
      <Typography variant="caption">Similar communities:</Typography>
      <ul className={list}>
        {items.map((item) => (
          <li key={item}>
            <Chip
              component={RouterLink}
              size="small"
              color="secondary"
              avatar={<Avatar>{goodies[item][0]}</Avatar>}
              label={goodies[item]}
              to={`${routes.grid}/${item}/${goodies[item]}`}
            />
          </li>
        ))}
      </ul>
      <p style={{ fontSize: 10, textAlign: 'left' }}>
        <b>@Ross:</b> If this is the only instance of a particular category (e.g
        there is only one "Quechua (Bolivian)"), do you think it should still be
        included as an option? I could see it either way- on one hand if it's
        included, it makes the UI consistent and shows the user that it's the
        only one of its kind. One the other hand... why would someone want to
        see a category list if there's only one item? My vote would probably be
        for consistency. One-item info is still info! Btw these things are
        called "chips" and they have some{' '}
        <a
          href="https://material-ui.com/components/chips/"
          rel="noopener noreferrer"
          target="_blank"
        >
          interesting options
        </a>
        .
      </p>
    </div>
  )
}

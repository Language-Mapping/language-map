import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { CountryListItemWithFlagProps } from './types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      alignItems: 'center',
      display: 'grid',
      gridColumnGap: theme.spacing(1),
      gridTemplateColumns: `${theme.spacing(3)}px auto`,
      gridTemplateRows: 'auto',
      lineHeight: 1, // proper vertical align (all good except super-long Congo)
      '& + li': {
        marginTop: 4,
      },
    },
    emojiFlag: {
      '& > img': {
        height: '100%',
        // Ensure outer white shapes are seen
        outline: `solid 1px ${theme.palette.divider}`,
      },
    },
  })
)

export const CountryListItemWithFlag: FC<CountryListItemWithFlagProps> = (
  props
) => {
  const { root, emojiFlag } = useStyles()
  const { name, url, filterClassName } = props

  return (
    <li className={`${root} ${filterClassName}`}>
      <div className={emojiFlag}>
        <img alt={`${name} flag`} src={url} />
      </div>
      <div>{name}</div>
    </li>
  )
}

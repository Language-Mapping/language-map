import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    countryWithFlagRoot: {
      alignItems: 'center',
      display: 'grid',
      gridColumnGap: theme.spacing(1),
      gridTemplateColumns: `${theme.spacing(3)}px auto`,
      gridTemplateRows: 'auto',
      lineHeight: 1, // proper vertical align (all good except super-long Congo)
      '& + li': {
        marginTop: 2,
      },
    },
    emojiFlag: {
      '& > img': {
        height: '100%',
        outline: `solid 1px ${theme.palette.divider}`, // to ensure outer white shapes are seen
      },
    },
  })
)

// CRED: // https://github.com/hjnilsson/country-flags
// NOTE: only the countries in the table were tested, and sometimes their
// country code/name was edited in `config.emojis.json` accordingly. Anything
// wrong may have to be addressed in that config, the data, the SVG icons
// themselves, or some combination thereof.
export const CountryListItemWithFlag: FC<{ name: string; url: string }> = (
  props
) => {
  const classes = useStyles()
  const { countryWithFlagRoot, emojiFlag } = classes
  const { name, url } = props

  return (
    <li className={countryWithFlagRoot}>
      <div className={emojiFlag}>
        <img alt={`${name} flag`} src={url} />
      </div>
      <div>{name}</div>
    </li>
  )
}

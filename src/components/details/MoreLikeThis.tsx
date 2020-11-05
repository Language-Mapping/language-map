import React, { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Paper } from '@material-ui/core'
import { BiUserVoice } from 'react-icons/bi'
import { IoIosPeople } from 'react-icons/io'

import { paths as routes } from 'components/config/routes'
import { useSymbAndLabelState } from 'components'
import { getCodeByCountry } from 'components/results'
import { LegendSwatch } from 'components/legend'
import { LangRecordSchema } from '../../context/types'

type ImportantCols = Pick<
  LangRecordSchema,
  'Language' | 'Country' | 'World Region'
>
type ColumnKeys = keyof ImportantCols

// TODO: simplify all this to just need routeValues and a country flag
type MoreLikeThis = {
  language: string
  region: string
  country: string
  macro?: string
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
      padding: '0.15em 0.45em',
      lineHeight: 1.5,
      marginBottom: '0.25em', // otherwise crowded when wrapped
      transition: '300ms backgroundColor ease',
      '&:hover': {
        backgroundColor: theme.palette.secondary.dark,
      },
      '& > :first-child': {
        marginRight: '0.35em',
      },
      '& > svg': {
        fontSize: '1.25em',
      },
      '& .country-flag': {
        // Ensure outer white shapes are seen
        outline: `solid 1px ${theme.palette.divider}`,
        height: 12,
      },
    },
  })
)

const CustomChip: FC<{ to: string; name: string }> = (props) => {
  const classes = useStyles()
  const { children, to, name } = props

  return (
    <Paper
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      component={RouterLink}
      to={to}
      title={`View more ${name} communities`}
      elevation={2}
      className={classes.chip}
    >
      {children}
    </Paper>
  )
}

export const MoreLikeThis: FC<MoreLikeThis> = (props) => {
  const { language, region, country, macro } = props
  const symbLabelState = useSymbAndLabelState()
  const classes = useStyles()
  const regionSwatchColor =
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    symbLabelState.legendSymbols[region].paint['icon-color'] as string

  // Careful, not using TS on the mid-route paths, e.g. "World Region"
  return (
    <div className={classes.root}>
      <CustomChip name={language} to={`${routes.grid}/Language/${language}`}>
        <BiUserVoice /> {language}
      </CustomChip>
      {country.split(', ').map((countryName) => (
        <CustomChip
          key={countryName}
          name={countryName}
          to={`${routes.grid}/Country/${countryName}`}
        >
          <img
            className="country-flag"
            alt={`${countryName} flag`}
            src={`/img/country-flags/${getCodeByCountry(
              countryName
            ).toLowerCase()}.svg`}
          />{' '}
          {countryName}
        </CustomChip>
      ))}
      <CustomChip name={region} to={`${routes.grid}/World Region/${region}`}>
        <LegendSwatch
          legendLabel={region}
          labelStyleOverride={{ fontSize: 'inherit' }}
          component="div"
          iconID="_circle"
          backgroundColor={regionSwatchColor || 'transparent'}
        />
      </CustomChip>
      {macro && (
        <CustomChip name={macro} to={`${routes.grid}/Macro-Community/${macro}`}>
          <IoIosPeople /> {macro}
        </CustomChip>
      )}
    </div>
  )
}

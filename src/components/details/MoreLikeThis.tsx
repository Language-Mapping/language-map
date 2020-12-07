import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { BiUserVoice } from 'react-icons/bi'
import { IoIosPeople } from 'react-icons/io'

import { paths as routes } from 'components/config/routes'
import { useSymbAndLabelState } from 'components/context'
import { getCodeByCountry } from 'components/results'
import { LegendSwatch } from 'components/legend'
import { SeeRelatedChip } from 'components/details'

import * as Types from './types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      fontSize: '0.75rem',
      justifyContent: 'center',
      flexWrap: 'wrap',
      margin: '0.5rem 0',
      '& > * + *': {
        marginLeft: '0.35rem',
      },
    },
  })
)

export const MoreLikeThis: FC<Types.MoreLikeThisProps> = (props) => {
  const { children, language, region, country, macro } = props
  const symbLabelState = useSymbAndLabelState()
  const classes = useStyles()
  const regionSwatchColor =
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    symbLabelState.legendSymbols[region].paint['icon-color'] as string

  // Careful, not using TS on the mid-route paths, e.g. "World Region"
  return (
    <div className={classes.root}>
      {children}
      {language && (
        <SeeRelatedChip
          name={language}
          to={`${routes.grid}/Language/${language}`}
        >
          <BiUserVoice /> {language}
        </SeeRelatedChip>
      )}
      {country &&
        country.split(', ').map((countryName) => (
          <SeeRelatedChip
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
          </SeeRelatedChip>
        ))}
      <SeeRelatedChip
        name={region}
        to={`${routes.grid}/World Region/${region}`}
      >
        <LegendSwatch
          legendLabel={region}
          labelStyleOverride={{ fontSize: '0.7rem' }}
          component="div"
          iconID="_circle"
          backgroundColor={regionSwatchColor || 'transparent'}
        />
      </SeeRelatedChip>
      {macro && (
        <SeeRelatedChip
          name={macro}
          to={`${routes.grid}/Macrocommunity/${macro}`}
        >
          <IoIosPeople /> {macro}
        </SeeRelatedChip>
      )}
    </div>
  )
}

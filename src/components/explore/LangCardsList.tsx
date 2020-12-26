import React, { FC } from 'react'
import { useParams } from 'react-router-dom'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

import { DetailsSchema } from 'components/context'
import { Media } from 'components/media'
import { MoreLikeThis, NeighborhoodList } from 'components/details'
import { LoadingIndicatorBar } from 'components/generic/modals'
import { PanelContent } from 'components/panels'
import { ReadMore } from 'components/generic'
import { CensusPopover } from './CensusPopover'
import { useAirtable } from './hooks'

import * as Types from './types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    statsAndMeta: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      display: 'inline-flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      '& > :not(:last-child)': {
        borderRight: `solid 1px ${theme.palette.text.secondary}`,
        marginRight: '0.4rem',
        paddingRight: '0.4rem',
      },
    },
  })
)

const StatsAndMeta: FC<{ data: Partial<DetailsSchema> }> = (props) => {
  const { data = {} } = props
  const classes = useStyles()

  return (
    <ul className={classes.statsAndMeta}>
      {data['Global Speaker Total'] && (
        <li>
          <b>Global speakers:</b>{' '}
          {data['Global Speaker Total'].toLocaleString()}
        </li>
      )}
      {data.Glottocode && (
        <li>
          <b>Glottocode:</b> {data.Glottocode}
        </li>
      )}
      {data['ISO 639-3'] && (
        <li>
          <b>ISO 639-3:</b> {data['ISO 639-3']}
        </li>
      )}
    </ul>
  )
}

// aka pre-Details, aka Language Profile
export const LangCardsList: FC = () => {
  const { field, value, language } = useParams() as Types.RouteMatch
  let filterByFormula
  if (language)
    filterByFormula = `AND(FIND('${value}', ARRAYJOIN({${field}})) != 0, {name} = '${language}')`
  else filterByFormula = `{name} = '${value}'`

  const { data, error, isLoading } = useAirtable('Language', {
    filterByFormula,
  })

  if (isLoading)
    return (
      <PanelContent>
        <LoadingIndicatorBar omitText />
      </PanelContent>
    )

  if (error) return <PanelContent>{error?.message}</PanelContent>
  if (!data.length) return <PanelContent>No match found.</PanelContent>

  const thisLangConfig = data[0]
  const { Endonym, Description, Language } = thisLangConfig || {}

  const Extree = (
    <>
      <MoreLikeThis data={thisLangConfig} omitLocation omitMacro />
      <CensusPopover data={thisLangConfig} />
      <Media data={thisLangConfig} shareNoun="profile" omitClear />
      {Description && <ReadMore text={Description} />}
    </>
  )

  return (
    <PanelContent
      subtitle={Endonym === Language ? '' : Endonym}
      subSubtitle={<StatsAndMeta data={data[0]} />}
      extree={Extree}
    >
      <NeighborhoodList data={thisLangConfig} />
    </PanelContent>
  )
}

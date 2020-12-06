import React, { FC, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from '@material-ui/core'
import { BiMapPin } from 'react-icons/bi'
import { FaClipboardList } from 'react-icons/fa'

import {
  GlobalContext,
  useMapToolsState,
  useMapToolsDispatch,
} from 'components/context'
import { ReadMore } from 'components/generic'
import { CustomCard } from './CustomCard'
import { CardList } from './CardList'
import { ExploreSubView } from './ExploreSubView'

import * as Types from './types'
import * as utils from './utils'

export const LangCardsList: FC = () => {
  const { value, language } = useParams() as Types.RouteMatch
  const { state } = useContext(GlobalContext)
  const { langFeatures } = state
  const icon = <BiMapPin />
  const { langConfigViaSheets } = useMapToolsState()
  const mapToolsDispatch = useMapToolsDispatch()

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore // not for lack of trying
  const uniqueInstances = langFeatures.reduce((all, thisOne) => {
    const { Neighborhood, Town, Language, Description } = thisOne

    // Deep depth
    if (language) {
      if (Language !== language) return all
    } else if (Language !== value) return all

    if (!Neighborhood && all.find((item) => item.title === Town)) return all

    const common = {
      footer: `${Description.slice(0, 100).trimEnd()}...`,
      intro: '', // TODO: rm if not using
      to: thisOne.ID,
      icon,
    }

    if (!Neighborhood) return [...all, { title: Town, ...common }]

    return [
      ...all,
      ...Neighborhood.split(', ')
        .filter((hood) => !all.find((item) => item.title === hood))
        .map((hood) => ({ title: hood, ...common })),
    ]
  }, [] as Types.CardConfig[]) as Types.CardConfig[]

  const {
    'ISO 639-3': iso,
    Glottocode,
    Endonym,
    Description,
    'PUMA Field': pumaField,
    'Tract Field': tractField,
  } =
    langConfigViaSheets.find(
      ({ Language }) => Language === (language || value)
    ) || {}

  const hasCensus = pumaField || tractField

  const CensusLink = (
    <div style={{ marginTop: '1em' }}>
      <Button
        size="small"
        color="primary"
        variant="contained"
        onClick={(e: React.MouseEvent) => {
          mapToolsDispatch({
            type: 'SET_CENSUS_FIELD',
            censusType: pumaField ? 'puma' : 'tracts', // CAREFUL: Assumptions
            payload: pumaField || tractField,
          })
        }}
      >
        <FaClipboardList
          style={{ color: 'inherit', height: '1.2em', width: '1.2em' }}
        />{' '}
        Set census (works)
      </Button>
      <br />
      <br />
      ...but will be a chip with a popout containing all the stuff mentioned in
      GH.
    </div>
  )

  const SubTitle = (
    <>
      {Glottocode && `GLOTTOCODE: ${Glottocode}`}
      {iso && `${Glottocode && ' | '}ISO 639-3: ${iso}`}
      {hasCensus ? CensusLink : null}
      {Description && <ReadMore text={Description} />}
    </>
  )

  // TODO: FaClipboardList for census chip
  return (
    <ExploreSubView
      instancesCount={uniqueInstances.length}
      subtitle={Endonym}
      subSubtitle={SubTitle}
    >
      <CardList>
        {uniqueInstances.sort(utils.sortByTitle).map((instance) => (
          <CustomCard
            key={instance.title}
            {...instance}
            url={`/details/${instance.to}`}
          />
        ))}
      </CardList>
    </ExploreSubView>
  )
}

import React, { FC, useState } from 'react'
import { useParams, useRouteMatch } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Button } from '@material-ui/core'
import { FiShare } from 'react-icons/fi'

import { BasicExploreIntro } from 'components/panels'
import { LoadingIndicator } from 'components/generic/modals'
import {
  Explanation,
  UItextFromAirtable,
  ShareButtons,
  ShareButtonsWrap,
} from 'components/generic'
import { sortArrOfObjects } from 'components/legend/utils'
import { CardListWrap } from './CardList'
import { useAirtable } from './hooks'
import { TonsWithAddl, MidLevelExploreProps } from './types'
import { AddlLanguages } from './AddlLanguages'
import { CustomCard } from './CustomCard'
import { LayerToggle } from './LayerToggle'
import { ClearSelectionBtn } from './ClearSelectionBtn'

type ATresponse = TonsWithAddl & {
  name: string
  endonyms: string[]
  County?: string
  summary?: string
  'data-descrips'?: string[]
}

type CardsPrep = {
  lang: string
  endo: string
  descrip: string
}

const fields = [
  'Additional Languages',
  'County',
  'data-descrips',
  'endonyms',
  'languages',
  'name',
  'summary',
]

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttonWrap: {
      display: 'grid',
      justifyContent: 'center',
      gridTemplateColumns: '1fr auto auto',
      gridColumnGap: '0.25rem',
      // UGHHH
      '& .MuiButton-startIcon': {
        marginRight: 4,
      },
      '& .MuiButton-textSizeSmall': {
        fontSize: '0.85rem',
        [theme.breakpoints.down('sm')]: {
          minWidth: 'auto',
        },
      },
    },
    // wowww overkill, but it fits...
    hideOnMobile: {
      whiteSpace: 'pre',
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },
  })
)

export const NeighborhoodsInstance: FC<MidLevelExploreProps> = (props) => {
  const { value } = useParams<{ value: string }>()
  const { url } = useRouteMatch()
  const classes = useStyles()
  const [showShareBtns, setShowShareBtns] = useState<boolean>(false)

  const { data, error, isLoading } = useAirtable<ATresponse>('Neighborhood', {
    fields,
    filterByFormula: `{name} = "${value}"`,
    sort: [{ field: 'name' }],
    maxRecords: 1,
  })

  if (isLoading) return <LoadingIndicator omitText />
  if (error) {
    return (
      <>
        Could not load {value}. {error?.message}
      </>
    )
  }

  const {
    'data-descrips': dataDescrips,
    'Additional Languages': addlLanguages,
    languages,
    endonyms,
    summary,
    County,
  } = data[0] || {}

  const shareSrcAndTitle = `${value} - Languages of New York City Map`
  const Extree = (
    <>
      <div className={classes.buttonWrap}>
        <LayerToggle layerID="neighborhoods" excludeWrap />
        <ClearSelectionBtn />
        <Button
          size="small"
          color="secondary"
          title="Share this neighborhood"
          startIcon={<FiShare />}
          onClick={() => setShowShareBtns(!showShareBtns)}
        >
          <span className={classes.hideOnMobile}>Share</span>
        </Button>
      </div>
      <ShareButtonsWrap shareText="neighborhood" showShareBtns={showShareBtns}>
        <ShareButtons
          spacing={2}
          source={shareSrcAndTitle}
          summary={summary}
          title={shareSrcAndTitle}
          url={window.location.href}
        />
      </ShareButtonsWrap>
    </>
  )

  const sortedByLang = languages
    ?.map((lang, i) => ({
      lang,
      endo: endonyms[i],
      descrip: dataDescrips ? dataDescrips[i] : '',
    }))
    .sort(sortArrOfObjects<CardsPrep>('lang'))

  return (
    <>
      <BasicExploreIntro
        title={value}
        introParagraph={summary}
        subtitle={County}
        extree={isLoading ? <LoadingIndicator omitText /> : Extree}
      />
      {languages ? (
        <Explanation>
          <UItextFromAirtable id="neighb-loc-list" />
        </Explanation>
      ) : null}
      <CardListWrap>
        {sortedByLang?.map(({ lang, endo, descrip }, i) => (
          <CustomCard
            key={lang}
            intro={lang}
            timeout={350 + i * 250}
            title={endo}
            footer={descrip}
            url={`${url}/${lang}`}
          />
        ))}
      </CardListWrap>
      {addlLanguages && <AddlLanguages data={addlLanguages} />}
    </>
  )
}

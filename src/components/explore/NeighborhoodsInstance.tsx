import React, { FC, useState } from 'react'
import { useParams, useRouteMatch } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Button } from '@material-ui/core'
import { FiShare } from 'react-icons/fi'

import { BasicExploreIntro } from 'components/panels'
import { LoadingIndicatorBar } from 'components/generic/modals'
import {
  Explanation,
  UItextFromAirtable,
  ShareButtons,
  ShareButtonsWrap,
} from 'components/generic'
import { icons } from 'components/config'
import { CardListWrap } from './CardList'
import { useAirtable } from './hooks'
import { TonsWithAddl, MidLevelExploreProps } from './types'
import { AddlLanguages } from './AddlLanguages'
import { CustomCard } from './CustomCard'
import { LayerToggle } from './LayerToggle'
import { ClearSelectionBtn } from './ClearSelectionBtn'

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
  const { value } = useParams<{ field: string; value: string }>()
  const { url } = useRouteMatch()
  const classes = useStyles()
  const field = 'Neighborhood'
  const [showShareBtns, setShowShareBtns] = useState<boolean>(false)
  const { tableName = field, sortByField = 'name' } = props
  const fields = [
    'Additional Languages',
    'County',
    'data-descrips',
    'endonyms',
    'languages',
    'name',
    'summary',
  ]
  const shareSrcAndTitle = `${value} - Languages of New York City Map`

  const { data, error, isLoading } = useAirtable<
    TonsWithAddl & {
      name: string
      endonyms: string[]
      County?: string
      summary?: string
      'data-descrips'?: string[]
    }
  >(tableName, {
    fields,
    filterByFormula: `{name} = "${value}"`,
    sort: [{ field: sortByField }],
    maxRecords: 1,
  })

  if (isLoading) return <LoadingIndicatorBar />
  if (error) {
    return (
      <>
        Could not load {value}. {error?.message}
      </>
    )
  }
  const firstRecord = data[0]
  const {
    'data-descrips': dataDescrips,
    'Additional Languages': addlLanguages,
  } = firstRecord || {}

  const Extree = (
    <>
      <div className={classes.buttonWrap}>
        <LayerToggle layerID="neighborhoods" />
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
          summary={firstRecord?.summary}
          title={shareSrcAndTitle}
          url={window.location.href}
        />
      </ShareButtonsWrap>
    </>
  )

  return (
    <>
      <BasicExploreIntro
        title={value}
        icon={icons.Neighborhood}
        introParagraph={firstRecord?.summary}
        subtitle={firstRecord?.County}
        extree={Extree}
      />
      {firstRecord?.languages ? (
        <Explanation>
          <UItextFromAirtable id="neighb-loc-list" />
        </Explanation>
      ) : null}
      <CardListWrap>
        {firstRecord?.languages?.map((langName, i) => (
          <CustomCard
            key={langName}
            intro={langName}
            title={firstRecord?.endonyms[i]}
            footer={dataDescrips ? dataDescrips[i] : ''}
            url={`${url}/${langName}`}
          />
        ))}
      </CardListWrap>
      {addlLanguages && <AddlLanguages data={addlLanguages} />}
    </>
  )
}

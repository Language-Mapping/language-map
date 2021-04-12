import React, { FC } from 'react'

import { BasicExploreIntro } from 'components/explore'
import { LoadingIndicatorBar } from 'components/generic/modals'
import { UItextFromAirtable } from 'components/generic'
import { icons } from 'components/config'
import { CardListWrap } from './CardList'
import { CustomCard } from './CustomCard'
import { useAirtable } from './hooks'
import { AirtableSchemaQuery } from './types'

// The top-level "/Explore" route as a landing page index to explorable fields
export const Explore: FC = () => {
  const { data, error, isLoading } = useAirtable<AirtableSchemaQuery>(
    'Schema',
    {
      filterByFormula: '{exploreSortOrder} > 0', // cheap check for Explore-ables
      sort: [{ field: 'exploreSortOrder' }],
    }
  )

  return (
    <>
      <BasicExploreIntro
        introParagraph={<UItextFromAirtable id="explore-intro" />}
      />
      {isLoading && <LoadingIndicatorBar omitText />}
      {error && 'Could not load'}
      <CardListWrap>
        {data.map(({ name, plural, definition }) => (
          <CustomCard
            key={name}
            icon={icons[name] || null}
            title={plural || ''} // TODO: ugh
            url={`/Explore/${name}`}
            footer={definition}
          />
        ))}
      </CardListWrap>
    </>
  )
}

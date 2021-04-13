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
      // Cheap check for Explore-ables:
      filterByFormula: '{exploreSortOrder} > 0',
      sort: [{ field: 'exploreSortOrder' }],
    }
  )

  return (
    <>
      <BasicExploreIntro
        introParagraph={<UItextFromAirtable id="explore-intro" />}
        noAppear={!isLoading}
      />
      {isLoading && <LoadingIndicatorBar omitText />}
      {error && 'Could not load'}
      <CardListWrap>
        {data.map(({ name, plural, definition }, i) => (
          <CustomCard
            key={name}
            icon={icons[name] || null}
            title={plural || ''} // TODO: ugh
            url={`/Explore/${name}`}
            timeout={350 + i * 250}
            footer={definition}
          />
        ))}
      </CardListWrap>
    </>
  )
}

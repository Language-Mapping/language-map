import React, { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Link } from '@material-ui/core'

import { BasicExploreIntro } from 'components/explore'
import { LoadingIndicatorBar } from 'components/generic/modals'
import { CustomCard } from './CustomCard'
import { CardList } from './CardList'
import { useAirtable } from './hooks'
import { AirtableSchemaQuery } from './types'
import { exploreIcons } from './config'

// The top-level "/Explore" route as a landing page index to explorable fields
export const Explore: FC = () => {
  const { data, error, isLoading } = useAirtable<AirtableSchemaQuery>(
    'Schema',
    {
      filterByFormula: '{exploreSortOrder} > 0', // cheap check for Explore-ables
      sort: [{ field: 'exploreSortOrder' }],
    }
  )
  // TODO: adapt or remove if not using
  // utils.pluralTextIfNeeded(uniqueInstances.length),

  const intro = (
    <>
      For an explanation of the options below, visit the{' '}
      <Link component={RouterLink} to="/Info/Help">
        Help page
      </Link>{' '}
      for definitions and additional info. You can also view and filter all
      language communities in the{' '}
      <Link component={RouterLink} to="/table">
        Data table
      </Link>{' '}
      as well.
    </>
  )

  return (
    <>
      <BasicExploreIntro introParagraph={intro} />
      {isLoading && <LoadingIndicatorBar omitText />}
      {error && 'Could not load'}
      <CardList>
        {data.map(({ name, plural, definition }) => (
          <CustomCard
            key={name}
            icon={exploreIcons[name] || null}
            title={plural || ''} // TODO: ugh
            url={`/Explore/${name}`}
            footer={definition}
          />
        ))}
      </CardList>
    </>
  )
}

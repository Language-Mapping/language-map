import React, { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Link } from '@material-ui/core'

import { BasicExploreIntro } from 'components/explore'
import { LoadingIndicatorBar } from 'components/generic/modals'
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
      <CardListWrap>
        {data.map(({ name, plural, definition }) => (
          <CustomCard
            key={name}
            icon={icons[name] || null}
            title={plural || ''} // TODO: ugh
            url={`/Explore/${name}`}
            // CRED: 🏅 https://css-tricks.com/almanac/properties/l/line-clamp/
            footer={
              <footer
                style={{
                  display: '-webkit-box',
                  overflow: 'hidden',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 3,
                }}
              >
                {definition}
              </footer>
            }
          />
        ))}
      </CardListWrap>
    </>
  )
}

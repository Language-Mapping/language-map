import React, { FC } from 'react'
import { useRouteMatch, useParams } from 'react-router-dom'

import { BiMapPin } from 'react-icons/bi'
import { SwatchOrFlagOrIcon } from 'components/generic/icons-and-swatches'
import { SwatchOnly } from 'components/legend'
import { PanelContent } from 'components/panels/PanelContent'
import { LoadingIndicatorBar } from 'components/generic/modals'
import { CustomCard } from './CustomCard'
import { CardList } from './CardList'
import * as Types from './types'
import { useAirtable } from './hooks'

export const MidLevelExplore: FC<Types.MidLevelExploreProps> = (props) => {
  // NOTE: basically using these three things to determine a LOT of decisions
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { field, value, language } = useParams() as Types.RouteMatch
  const {
    fields,
    tableName = field,
    sortByField = 'name',
    filterByFormula,
  } = props
  const { url } = useRouteMatch()
  let filter

  if (filterByFormula) filter = filterByFormula
  else if (value) filter = `{${field}} = '${value}'`

  const { data, error, isLoading } = useAirtable(tableName, {
    fields,
    ...(filter && { filterByFormula: filter }),
    sort: [{ field: sortByField }],
  })

  const {
    data: landingData,
    isLoading: isLandingLoading,
    error: landingError,
  } = useAirtable('Schema', {
    fields: ['name', 'definition', 'plural'],
    filterByFormula: `{name} = '${tableName}'`,
  })

  if (isLoading || isLandingLoading)
    // TODO: componentize
    return (
      <PanelContent>
        <LoadingIndicatorBar omitText />
      </PanelContent>
    )

  if (error || landingError) {
    return (
      <PanelContent>
        Could not load {value || field}.{' '}
        {error?.message || landingError?.message}
      </PanelContent>
    )
  }

  const footerIcon = (value !== undefined || tableName === 'Language') && (
    <BiMapPin />
  )
  const { definition, plural } = landingData[0] || {}
  const Icon = <SwatchOrFlagOrIcon field={tableName} value={value} />

  // TODO: better logic for instances, e.g. allow definition
  return (
    <PanelContent
      title={value || plural}
      icon={Icon}
      introParagraph={!value && definition}
    >
      <CardList>
        {data.map((row) => (
          <CustomCard
            key={row.name || row.Language}
            title={row.name || row.Language}
            intro={row.Endonym}
            footerIcon={footerIcon}
            uniqueInstances={row.languages || row['Primary Locations'] || []}
            url={`${url}/${row.name || row.Language}`}
            // TODO: use and refactor SwatchOrFlagOrIcon for icon prop
            icon={
              <>
                {row['icon-color'] && (
                  <SwatchOnly backgroundColor={row['icon-color']} />
                )}
                {row.src_image && (
                  <img
                    style={{ height: '0.8em', marginRight: '0.25em' }}
                    src={row.src_image[0].url}
                    alt={row.name || row.Language}
                  />
                )}
              </>
            }
          />
        ))}
      </CardList>
    </PanelContent>
  )
}

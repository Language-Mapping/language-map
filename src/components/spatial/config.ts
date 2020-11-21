import { MAPBOX_TOKEN } from 'components/map'

const MB_API_BASE = 'https://api.mapbox.com/v4'

export const censusFieldsDropdownOmit = ['GEOID', 'NAMELSAD', 'Total']

// YO: use from config?
export const endpoints = {
  puma: `${MB_API_BASE}/elalliance.5tfrskw8.json?access_token=${MAPBOX_TOKEN}`,
  tracts: `${MB_API_BASE}/elalliance.5dh31p39.json?access_token=${MAPBOX_TOKEN}`,
}

// TODO: rm tracts lookup table when ready

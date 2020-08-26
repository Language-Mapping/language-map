import { OutlinedTextFieldProps } from '@material-ui/core'
import { WorldRegionLegend } from './types'

export const commonSelectProps = {
  select: true,
  size: 'small',
  InputLabelProps: { disableAnimation: true, focused: true },
  SelectProps: { native: true },
} as OutlinedTextFieldProps

export const worldRegionLegend = {
  Africa: [
    'Eastern Africa',
    'Middle Africa',
    'Northern Africa',
    'Southern Africa',
    'Western Africa',
  ],
  Americas: [
    'Caribbean',
    'Central America',
    'Northern America',
    'South America',
  ],
  Asia: [
    'Central Asia',
    'Eastern Asia',
    'Southeastern Asia',
    'Southern Asia',
    'Western Asia',
  ],
  Europe: [
    'Eastern Europe',
    'Northern Europe',
    'Southern Europe',
    'Western Europe',
  ],
  Oceania: [
    'Australia and New Zealand', // maybe issues w/ampersand
    'Melanesia',
    'Micronesia',
    'Polynesia',
  ],
} as WorldRegionLegend

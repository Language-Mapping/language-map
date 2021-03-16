import React, { FC } from 'react'
import { Typography, Box } from '@material-ui/core'

import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css'

import { Explanation } from 'components/generic'
import { PanelSectionProps } from './types'
import { useLocalPanelStyles } from './styles'

export const LocationSearchContent: FC<PanelSectionProps> = (props) => {
  const { children, explanation, heading } = props
  const { root } = useLocalPanelStyles()

  return (
    <Box className={root}>
      {heading && (
        <Typography variant="h5" component="h3">
          {heading}
        </Typography>
      )}
      <Explanation>{explanation}</Explanation>
      {children}
    </Box>
  )
}

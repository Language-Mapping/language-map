import React, { FC } from 'react'
import { Popup } from 'react-map-gl'

import { PopupType } from './types'

type PopupComponentType = PopupType & {
  setPopupOpen: React.Dispatch<boolean>
}

export const MapPopup: FC<PopupComponentType> = ({
  heading,
  longitude,
  latitude,
  setPopupOpen,
}) => {
  return (
    <Popup
      tipSize={5}
      anchor="top"
      longitude={longitude}
      latitude={latitude}
      closeOnClick={false}
      onClose={() => setPopupOpen(false)}
    >
      {heading}
    </Popup>
  )
}

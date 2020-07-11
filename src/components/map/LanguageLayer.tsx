import React, { FC, useEffect, useState } from 'react'
import { Source, Layer } from 'react-map-gl'

type LangLayerType = {
  tilesetId: string
  styleUrl: string
  token?: string
}

export const LanguageLayer: FC<LangLayerType> = ({
  tilesetId,
  styleUrl,
  token,
}) => {
  const [layers, setLayers] = useState([])

  useEffect(() => {
    async function fetchMyAPI() {
      let response = await fetch(
        `https://api.mapbox.com/styles/v1/${styleUrl}?access_token=${token}`
      )
      response = await response.json()
      // TODO: fix it
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setLayers(response.layers)
    }

    fetchMyAPI()
  }, [token, styleUrl])

  return (
    <Source type="vector" url={`mapbox://${tilesetId}`} id="languages-src">
      {layers.map((layer) => (
        // TODO: fix it
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <Layer key={layer.id} {...layer} />
      ))}
    </Source>
  )
}

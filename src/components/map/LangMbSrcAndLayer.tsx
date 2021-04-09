import React, { FC, useEffect, useState } from 'react'
import { AnyLayout, Expression } from 'mapbox-gl'
import { Source, Layer } from 'react-map-gl'

import { useSymbAndLabelState } from 'components/context'
import { useAirtable } from 'components/explore/hooks'
import { prepEndoFilters, getFlyToPointSettings, flyToPoint } from './utils'
import { useLayersConfig, useSelLangPointCoords } from './hooks'

import * as config from './config'
import { LayerPropsPlusMeta, LangMbSrcAndLayerProps } from './types'

export const LangMbSrcAndLayer: FC<LangMbSrcAndLayerProps> = (props) => {
  const { map, isMapTilted, mapLoaded } = props
  const symbLabelState = useSymbAndLabelState()
  const selLangPointCoords = useSelLangPointCoords()
  const { lat, lon } = selLangPointCoords || {}

  const {
    activeLabelID,
    activeSymbGroupID,
    hideLangPoints,
    hideLangLabels,
  } = symbLabelState
  const {
    data: fontsData,
    isLoading: areFontsLoading,
    error: fontsError,
  } = useAirtable<{ name: string; Font: string }>('Language', {
    fields: ['name', 'Font'],
    filterByFormula: "{Font} != ''",
  })

  const { data: layersData, error: layersError } = useLayersConfig(
    activeSymbGroupID
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [endoFonts, setEndoFonts] = useState<any[]>()

  // TODO: useCallback or something
  const getLayout = (layout: AnyLayout): AnyLayout => {
    const bareMinimum: AnyLayout = {
      ...config.mapLabelDefaults.layout,
      ...layout,
    }

    if (hideLangLabels || !endoFonts) {
      return { ...bareMinimum, 'text-field': '' }
    }

    const isEndo = activeLabelID === 'Endonym'
    const defaultFont = ['Noto Sans Regular', 'Arial Unicode MS Regular']
    const defaultTextField: Expression = ['to-string', ['get', activeLabelID]]
    // TODO: check if 'Font Image Alt' is populated instead of using this
    // remnant of the Endo http check implemented before that field existed.
    const imgCheck: Expression = [
      'case',
      ['==', ['slice', ['get', 'Endonym'], 0, 4], ''],
      ['get', 'Language'],
      ['get', 'Endonym'],
    ]

    return {
      ...bareMinimum,
      'text-font': isEndo ? endoFonts : defaultFont,
      'text-field': isEndo ? imgCheck : defaultTextField,
    }
  }

  useEffect(() => {
    if (areFontsLoading || !fontsData.length) return

    setEndoFonts(prepEndoFilters(fontsData))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areFontsLoading])

  // Do selected feature stuff on sel feat change or map load
  useEffect(() => {
    if (!map || !mapLoaded || !lat || !lon) return

    const settings = getFlyToPointSettings({ lat, lon }, isMapTilted)

    flyToPoint(map, settings)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapLoaded, lat, lon]) // LEGIT disabling of deps. Breaks otherwise.

  if (fontsError || layersError)
    throw new Error(`Something went wrong setting up ${activeSymbGroupID}`)

  return (
    <Source
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore // promoteId is just not anywhere in the source...
      promoteId="id"
      type="vector"
      url={`mapbox://${config.mbStyleTileConfig.tilesetId}`}
      id={config.mbStyleTileConfig.langSrcID}
    >
      {layersData.map((layer: LayerPropsPlusMeta) => {
        let { paint, layout } = layer

        layout = getLayout(layout)

        if (hideLangLabels) {
          paint = { ...config.mapLabelDefaults.paint, ...paint }
        }

        // TODO: marker for selected feature
        if (hideLangPoints) layout = { ...layout, 'icon-size': 0 }

        return (
          <Layer
            key={layer.id}
            {...layer}
            type="symbol" // R.I.P. circles
            source-layer={config.mbStyleTileConfig.layerId}
            layout={layout}
            paint={paint}
          />
        )
      })}
    </Source>
  )
}

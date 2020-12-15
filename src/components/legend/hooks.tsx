import { useState, useEffect } from 'react'
import Airtable from 'airtable'

import { AIRTABLE_API_KEY, AIRTABLE_BASE } from 'components/config'
import * as utils from './utils'
import * as Types from './types'

export const useLegend = (
  config: Types.LegendConfigItem,
  tableName: string
): { error?: Error; data: Types.PreppedLegend[] } => {
  const [error, setError] = useState()
  const [data, setData] = useState<Types.PreppedLegend[]>([])
  const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE)

  useEffect(() => {
    const { fields } = config

    base(tableName)
      .select({ fields })
      // .all() // implement for larger queries over 100+
      .firstPage()
      .then((records) => {
        const prepped = utils.prepAirtableResponse(
          records.map((record) => record.fields),
          tableName,
          config
        )

        setData(prepped)
      })
      .catch((err) => {
        setError(err)
      })

    // dispatch({ type: 'SET_LANG_LAYER_LEGEND', payload: legend })
  }, [base, config, tableName])

  return { error, data }
}

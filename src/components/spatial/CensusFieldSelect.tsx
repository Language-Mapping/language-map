import React, { FC, useEffect, useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import {
  InputLabel,
  FormHelperText,
  FormControl,
  NativeSelect,
} from '@material-ui/core'

import { useMapToolsState, useMapToolsDispatch } from 'components/context'
import * as config from './config'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
  })
)

export type CensusFieldSelectProps = {
  stateKey: 'censusField' | 'pumaField'
}

export const CensusFieldSelect: FC<CensusFieldSelectProps> = (props) => {
  const { stateKey } = props
  const classes = useStyles()
  const field = useMapToolsState()[stateKey]
  const mapToolsDispatch = useMapToolsDispatch()
  const [fields, setFields] = useState<string[]>()

  useEffect(() => {
    if (stateKey === 'censusField') {
      setFields(config.censusLangFields)
    } else if (stateKey === 'pumaField') {
      const url =
        'https://api.mapbox.com/v4/elalliance.5tfrskw8.json?access_token=pk.eyJ1IjoiZWxhbGxpYW5jZSIsImEiOiJja2M1Nmd6YnYwZXQ4MnJvYjd6MnJsb25lIn0.AC_4h4BmJCg2YvlygXzLxQ'
      const fetchData = async () => {
        const result = await fetch(url)
        const jsonn = await result.json()
        const pumaFieldz = jsonn.vector_layers[0].fields
        const pumaFieldzNamez = Object.keys(pumaFieldz)
          .map((key) => key)
          .sort()
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        setFields(pumaFieldzNamez)
      }

      fetchData()
      // async (key: number): Promise<void> =>
      // (await fetch(`${WP_API_PAGES_ENDPOINT}/${key}`)).json()
    }
  }, [stateKey])

  const handleChange = (event: React.ChangeEvent<{ value: string }>) => {
    if (stateKey === 'censusField') {
      mapToolsDispatch({
        type: 'SET_CENSUS_FIELD',
        payload: event.target.value,
      })
    } else if (stateKey === 'pumaField') {
      mapToolsDispatch({
        type: 'SET_PUMA_FIELD',
        payload: event.target.value,
      })
    }
  }

  if (!fields) return <h2>Onnnnne second</h2>

  const ChangeField = (
    <FormControl className={classes.formControl}>
      <InputLabel htmlFor={`${stateKey}-field-helper`}>Show by</InputLabel>
      <NativeSelect
        value={field}
        onChange={handleChange}
        inputProps={{ name: 'field', id: `${stateKey}-field-helper` }}
      >
        <option aria-label="None" value="" selected />
        {fields.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </NativeSelect>
      <FormHelperText>Level: {stateKey}</FormHelperText>
    </FormControl>
  )

  return <div className={classes.root}>{ChangeField}</div>
}

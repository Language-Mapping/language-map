import React, { FC, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Slider } from '@material-ui/core'

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
})

function valuetext(value: number) {
  return `${value}`
}

export const GlobalSpeakSlider: FC = () => {
  const classes = useStyles()
  const [value, setValue] = useState<number[]>([20, 37])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (event: any, newValue: number | number[]) => {
    setValue(newValue as number[])
  }

  return (
    <div className={classes.root}>
      <Slider
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        getAriaValueText={valuetext}
      />
    </div>
  )
}

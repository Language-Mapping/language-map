import React, { FC, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Slider from '@material-ui/core/Slider'

const useStyles = makeStyles({
  root: {
    width: 300,
  },
})

function valuetext(value: number) {
  return `${value}`
}

export const DemoRangeSlider: FC = () => {
  const classes = useStyles()
  const [value, setValue] = useState<number[]>([20, 37])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (event: any, newValue: number | number[]) => {
    setValue(newValue as number[])
  }

  return (
    <div className={classes.root}>
      <Typography id="range-slider" gutterBottom>
        Size
      </Typography>
      <Slider
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        getAriaValueText={valuetext}
      />
    </div>
  )
}

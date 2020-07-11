import React, { FC, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Paper, Tabs, Tab } from '@material-ui/core'

type PanelTabsTmpType = {
  content: string
  hasTabs: boolean
}

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
})

export const PanelTabsTmp: FC<PanelTabsTmpType> = ({ content, hasTabs }) => {
  const classes = useStyles()
  const [value, setValue] = useState(0)

  // eslint-disable-next-line @typescript-eslint/ban-types
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue)
  }

  return (
    <Paper className={classes.root}>
      {content}
      {hasTabs && (
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          centered
          variant="fullWidth"
        >
          <Tab label="One" />
          <Tab label="Two" />
          <Tab label="Three" />
        </Tabs>
      )}
    </Paper>
  )
}

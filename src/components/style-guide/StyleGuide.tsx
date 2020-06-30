import React, { FC } from 'react'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import { Container, Paper } from '@material-ui/core'

import {
  DemoBtns,
  DemoCheckboxes,
  DomElements,
  DemoRadios,
  DemoRangeSlider,
  DemoSwitches,
  DemoTextFields,
  DemoNativeSelects,
} from 'components/style-guide'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > .MuiPaper-root': {
        margin: theme.spacing(2),
        padding: theme.spacing(3),
      },
      '& .MuiPaper-root .MuiPaper-root': {
        margin: theme.spacing(1),
        padding: theme.spacing(2),
      },
    },
  })
)

export const StyleGuide: FC = () => {
  const classes = useStyles()

  return (
    <Container maxWidth="md" className={classes.root}>
      <Paper>
        <h2>Standard HTML Elements</h2>
        <DomElements />
      </Paper>
      <Paper>
        <h2>Buttons</h2>
        <DemoBtns />
      </Paper>
      <Paper>
        <h2>Form Inputs</h2>
        <Paper>
          <h3>Checkboxes</h3>
          <DemoCheckboxes />
        </Paper>
        <Paper>
          <h3>Switches</h3>
          <DemoSwitches />
        </Paper>
        <Paper>
          <h3>Radio Buttons</h3>
          <DemoRadios />
        </Paper>
        <Paper>
          <h3>Range Slider</h3>
          <DemoRangeSlider />
        </Paper>
        <Paper>
          <h3>Text Input Fields</h3>
          <DemoTextFields />
        </Paper>
        <Paper>
          <h3>Native Dropdown Selects</h3>
          <p>
            Note that we would most likely use a better Select library like{' '}
            <a href="https://react-select.com/home" target="_blank">
              react-select
            </a>
            .
          </p>
          <DemoNativeSelects />
        </Paper>
      </Paper>
      {/* <ColorSchemeDemo /> */}
    </Container>
  )
}

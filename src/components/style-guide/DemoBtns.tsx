import React, { FC } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { Button, ButtonGroup, IconButton, Paper } from '@material-ui/core'
import { MdDelete } from 'react-icons/md'

import { DemoSplitBtn } from 'components/style-guide'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
  })
)

// NOTE: just about everything below was copied from the MUI docs:
// https://material-ui.com/components/buttons/
export const DemoBtns: FC = () => {
  const classes = useStyles()

  return (
    <div>
      <p>
        These are definitely from MUI and contain a lot of useful variations.
      </p>
      <Paper elevation={4}>
        <h3>Contained</h3>
        <div className={classes.root}>
          <Button variant="contained">Default</Button>
          <Button variant="contained" color="primary">
            Primary
          </Button>
          <Button variant="contained" color="secondary">
            Secondary
          </Button>
          <Button variant="contained" disabled>
            Disabled
          </Button>
          <Button variant="contained" color="primary" href="#contained-buttons">
            Link
          </Button>
        </div>
      </Paper>
      <Paper elevation={4}>
        <h3>Text</h3>
        <div className={classes.root}>
          <Button>Default</Button>
          <Button color="primary">Primary</Button>
          <Button color="secondary">Secondary</Button>
          <Button disabled>Disabled</Button>
          <Button href="#text-buttons" color="primary">
            Link
          </Button>
        </div>
      </Paper>
      <Paper elevation={4}>
        <h3>Outlined</h3>
        <div className={classes.root}>
          <Button variant="outlined">Default</Button>
          <Button variant="outlined" color="primary">
            Primary
          </Button>
          <Button variant="outlined" color="secondary">
            Secondary
          </Button>
          <Button variant="outlined" disabled>
            Disabled
          </Button>
          <Button variant="outlined" color="primary" href="#outlined-buttons">
            Link
          </Button>
        </div>
      </Paper>
      <Paper elevation={4}>
        <h3>Sizes</h3>
        <p>
          Button sizes are pretty straightforward and are handy for adapting to
          limited or spacious containers.
        </p>
        <div className={classes.root}>
          <Button size="small">Small</Button>
          <Button size="medium">Medium</Button>
          <Button size="large">Large</Button>
        </div>
        <div className={classes.root}>
          <Button variant="outlined" size="small" color="primary">
            Small
          </Button>
          <Button variant="outlined" size="medium" color="primary">
            Medium
          </Button>
          <Button variant="outlined" size="large" color="primary">
            Large
          </Button>
        </div>
        <div className={classes.root}>
          <Button variant="contained" size="small" color="primary">
            Small
          </Button>
          <Button variant="contained" size="medium" color="primary">
            Medium
          </Button>
          <Button variant="contained" size="large" color="primary">
            Large
          </Button>
        </div>
        <div className={classes.root}>
          <IconButton aria-label="delete" size="small">
            <MdDelete fontSize="inherit" />
          </IconButton>
          <IconButton aria-label="delete">
            <MdDelete fontSize="small" />
          </IconButton>
          <IconButton aria-label="delete">
            <MdDelete />
          </IconButton>
          <IconButton aria-label="delete">
            <MdDelete fontSize="large" />
          </IconButton>
        </div>
        <div className={classes.root}>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<MdDelete />}
          >
            Primary + icon
          </Button>
          {/* This Button uses a Font Icon, see the installation instructions in the Icon component docs. */}
          <Button
            variant="contained"
            color="primary"
            endIcon={<MdDelete>Text first</MdDelete>}
          >
            Text first
          </Button>
          <Button variant="contained" color="default" startIcon={<MdDelete />}>
            Default + icon
          </Button>
          <Button
            variant="contained"
            disabled
            color="secondary"
            startIcon={<MdDelete />}
          >
            Disabled
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<MdDelete />}
          >
            Small + icon
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<MdDelete />}
          >
            Large + icon
          </Button>
        </div>
      </Paper>
      <Paper elevation={4}>
        <h3>Button Group</h3>
        <p>
          Not sure if we would use this but it could be handy for a baselayer
          selector (e.g. Mapbox Streets, Aerial, or Dark) in case a radio group
          makes less sense.
        </p>
        <div className={classes.root}>
          <ButtonGroup
            color="primary"
            aria-label="outlined primary button group"
          >
            <Button>One</Button>
            <Button>Two</Button>
            <Button>Three</Button>
          </ButtonGroup>
          <ButtonGroup
            variant="contained"
            color="primary"
            aria-label="contained primary button group"
          >
            <Button>One</Button>
            <Button>Two</Button>
            <Button>Three</Button>
          </ButtonGroup>
          <ButtonGroup
            variant="text"
            color="primary"
            aria-label="text primary button group"
          >
            <Button>One</Button>
            <Button>Two</Button>
            <Button>Three</Button>
          </ButtonGroup>
        </div>
      </Paper>
      <Paper elevation={4}>
        <h3>Split Button</h3>
        <div className={classes.root}>
          <DemoSplitBtn />
        </div>
      </Paper>
    </div>
  )
}

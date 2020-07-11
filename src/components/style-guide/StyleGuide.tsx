import React, { FC } from 'react'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import { Container, Paper, Typography } from '@material-ui/core'

import {
  DemoBreadcrumbs,
  DemoBtns,
  DemoCard,
  DemoCheckboxes,
  DemoColors,
  DemoMediaCard,
  DemoNativeSelects,
  DemoRadios,
  DemoRangeSlider,
  DemoSwitches,
  DemoTextFields,
  DomElements,
} from 'components/style-guide'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& .MuiPaper-root': {
        padding: `${theme.spacing(3)}px ${theme.spacing(3)}px`,
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(4),
      },
      '& .MuiPaper-root .MuiPaper-root': {
        padding: `${theme.spacing(2)}px ${theme.spacing(2)}px`,
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(4),
      },
      '& .MuiPaper-root .MuiPaper-root > h3:first-child': {
        borderBottomColor: theme.palette.grey[600],
        borderBottomStyle: 'dotted',
        borderBottomWidth: 1,
      },
    },
    pageHeader: {
      marginTop: theme.spacing(6),
    },
  })
)

export const StyleGuide: FC = () => {
  const classes = useStyles()

  return (
    <Container maxWidth="md" className={classes.root}>
      <DemoBreadcrumbs />
      <Typography
        variant="h1"
        data-testid="style-guide-pg-title"
        className={classes.pageHeader}
      >
        Style Guide Demo
      </Typography>
      <p>
        This is not meant to be a comprehensive set of all UI variations, but it
        should represent the <i>majority</i> of them. The page will not be
        advertised to users in any way as it is for internal purposes only.
      </p>
      <Paper elevation={4}>
        <Typography component="h2" variant="h3">
          Standard HTML Elements
        </Typography>
        <DomElements />
      </Paper>
      <Paper elevation={4}>
        <Typography component="h2" variant="h3">
          Buttons
        </Typography>
        <DemoBtns />
      </Paper>
      <Paper elevation={4}>
        <Typography component="h2" variant="h3">
          Form Inputs
        </Typography>
        <p>
          These controls are the meat of user input. There are others available
          and we can add if needed, but the ones below should cover the majority
          of common input scenarios.
        </p>
        <Paper elevation={4}>
          <Typography component="h3" variant="h4">
            Checkboxes
          </Typography>
          <DemoCheckboxes />
        </Paper>
        <Paper elevation={4}>
          <Typography component="h3" variant="h4">
            Switches
          </Typography>
          <p>
            An alternative to regular checkboxes (although there are reasons to
            use one over the other), <b>Switches</b> have more of a "native app"
            look and feel to them. Without looking into the "reasons" as
            mentioned, switches seem better for visibility-type control such as
            toggling a layer, while checkboxes seem better suited to Yes/No
            things like "Show only results with videos".
          </p>
          <DemoSwitches />
        </Paper>
        <Paper elevation={4}>
          <Typography component="h3" variant="h4">
            Radio Buttons
          </Typography>
          <p>
            If a non-standard component is not used for mutually-exclusive
            things like baselayer selection, then <b>Radio Buttons</b> are the
            standard go-to (and likely better for accessibility).
          </p>
          <DemoRadios />
        </Paper>
        <Paper elevation={4}>
          <Typography component="h3" variant="h4">
            Range Slider
          </Typography>
          <p>
            There are several variations of this which provide plenty of
            flexibility, but just looking to demonstrate the basics here.
          </p>
          <DemoRangeSlider />
        </Paper>
        <Paper elevation={4}>
          <Typography component="h3" variant="h4">
            Text Input Fields
          </Typography>
          <p>
            The app probably won't have a ton of open-text inputs, but{' '}
            <b>Description</b> would be an exception. Most likely will use a
            third-party autosuggest component for that, though.
          </p>
          <DemoTextFields />
        </Paper>
        <Paper elevation={4}>
          <Typography component="h3" variant="h4">
            Native Dropdown Selects
          </Typography>
          <p>
            Note that we would most likely use a better Select library like{' '}
            <a
              href="https://react-select.com/home"
              target="_blank"
              rel="noopener noreferrer"
            >
              react-select
            </a>
            .
          </p>
          <DemoNativeSelects />
        </Paper>
      </Paper>
      <Paper elevation={4}>
        <Typography component="h2" variant="h3">
          Colors
        </Typography>
        <p>
          MUI includes a set of colors (and automatic{' '}
          <a
            href="https://material-ui.com/customization/palette/#default-values"
            target="_blank"
            rel="noopener noreferrer"
          >
            variations/shades
          </a>
          ) based on them. For the most part they are hands-off unless there is
          a reason to change them, with the exception of choosing the{' '}
          <code>primary</code> and
          <code>secondary</code> base colors.
        </p>
        <DemoColors />
      </Paper>
      <Paper elevation={4}>
        <Typography component="h2" variant="h3">
          Cards
        </Typography>
        <p>
          <b>Cards</b> are a Frankensteined set of MUI components for fancy
          media and information display. The ones below are verrrry contrived
          examples that were created quickly, but even still they look pretty
          decent and perhaps could be used for the "Info View" of a selected
          feature? They would contain a lot more info than what's shown below,
          so the presentation would have to be thought out carefully (especially
          with mobile in mind).
        </p>
        <Paper elevation={4}>
          <Typography component="h3" variant="h4">
            Media Card
          </Typography>
          <DemoMediaCard />
        </Paper>
        <Paper elevation={4}>
          <Typography component="h3" variant="h4">
            Complex Card
          </Typography>
          <DemoCard />
        </Paper>
      </Paper>
      <Paper elevation={4}>
        <Typography component="h2" variant="h3">
          TODOs
        </Typography>
        <p>
          Getting a little burned out and maybe sidetracked on style guide, need
          to start doing some other tasks, but good start for now (although 0
          efforts have been made towards mobile-friendliness). Here are some
          main remaining components that should be included:
        </p>
        <ul>
          <li>Dialogs</li>
          <li>List components</li>
          <li>Grid with spacing</li>
          <li>Snackbars/alerts</li>
          <li>React Select (different site)</li>
        </ul>
        <p>
          Most of these can be found in the{' '}
          <a
            href="https://material-ui.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            MUI docs
          </a>{' '}
          under "Components".
        </p>
      </Paper>
    </Container>
  )
}

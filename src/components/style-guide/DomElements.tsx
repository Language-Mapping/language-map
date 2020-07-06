import React, { FC } from 'react'
import { Link, Paper, Typography } from '@material-ui/core'

const fakeCode = `<HeyThere>
  <HowDidYou>
    Find this place???
  </HowDidYou>
</HeyThere>`

export const DomElements: FC = () => {
  return (
    <div>
      <p>
        This is stuff that's just built right into HTML. No MUI fanciness, just
        regular elements.
      </p>
      <Paper elevation={4}>
        <Typography component="h3" variant="h4">
          Headings
        </Typography>
        <Typography variant="h1" component="h1">
          Heading level 1
        </Typography>
        <Typography variant="h2" component="h2">
          Heading level 2
        </Typography>
        <Typography variant="h3" component="h3">
          Heading level 3
        </Typography>
        <Typography variant="h4" component="h4">
          Heading level 4
        </Typography>
        <Typography variant="h5" component="h5">
          Heading level 5
        </Typography>
      </Paper>
      <Paper elevation={4}>
        <Typography component="h3" variant="h4">
          Text
        </Typography>
        <p>
          The map is committed to representing many of the smaller, minority,
          and Indigenous languages that are primarily oral and have neither
          public visibility nor official support. It represents ELA’s ongoing
          effort to draw on all available sources, including thousands of
          interviews and discussions, to tell the continuing story of the
          city’s many languages and cultures. The patterns it reveals — the
          clustering of West African languages in Harlem and the Bronx, a
          microcosm of the former Soviet Union in south Brooklyn, the
          multifaceted Asian-language diversity of Queens, to name a few —
          only hint at the linguistic complexity of a city where a single
          building or block can host speakers of dozens of languages from across
          the globe.
        </p>
        <p>
          <b>This is bold text.</b>
        </p>
        <p>
          <i>This is italic text.</i>
        </p>
        <p>
          This is{' '}
          <Link href="#fake-tro" title="Your target, your fault">
            a hyperlink
          </Link>{' '}
          to nowhere.
        </p>
      </Paper>
      <Paper elevation={4}>
        <Typography component="h3" variant="h4">
          Lists
        </Typography>
        <Typography component="h4">Ordered</Typography>
        <ol>
          <li>Ok then</li>
          <li>Here is</li>
          <li>List item</li>
        </ol>
        <Typography component="h4">Unordered</Typography>
        <ul>
          <li>Ok then</li>
          <li>Here is</li>
          <li>List item</li>
        </ul>
      </Paper>
      <Paper elevation={4}>
        <Typography component="h3" variant="h4">
          Code
        </Typography>
        <p>
          It's unlike that we'll have any code to display, but the {`<pre>`}{' '}
          element could be useful in other cases (although I can't think of any
          at the moment). Just including it since it came over from the style
          guide I started from.
        </p>
        <pre>{fakeCode}</pre>
      </Paper>
    </div>
  )
}

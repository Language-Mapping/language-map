import React, { FC } from 'react'
import { Link, Paper } from '@material-ui/core'

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
        <h3>Headings</h3>
        <h1>Heading level 1</h1>
        <h2>Heading level 2</h2>
        <h3>Heading level 3</h3>
        <h4>Heading level 4</h4>
        <h5>Heading level 5</h5>
      </Paper>
      <Paper elevation={4}>
        <h3>Text</h3>
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
        <h3>Lists</h3>
        <h4>Ordered</h4>
        <ol>
          <li>Ok then</li>
          <li>Here is</li>
          <li>List item</li>
        </ol>
        <h4>Unordered</h4>
        <ul>
          <li>Ok then</li>
          <li>Here is</li>
          <li>List item</li>
        </ul>
      </Paper>
      <Paper elevation={4}>
        <h3>Code</h3>
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

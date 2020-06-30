import React, { FC } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { Link, Paper } from '@material-ui/core'

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

const fakeCode = `<heyman>
  <HowDidYou>
    Find this place???
  </HowDidYou>
</heyman>`

export const DomElements: FC = () => {
  const classes = useStyles()

  return (
    <div>
      <Paper>
        <h3>Headings</h3>
        <h1>Heading level 1</h1>
        <h2>Heading level 2</h2>
        <h3>Heading level 3</h3>
        <h4>Heading level 4</h4>
        <h5>Heading level 5</h5>
      </Paper>
      <Paper>
        <h3>Colors</h3>
        <p>TODO: insert palette/s</p>
      </Paper>
      <Paper>
        <h3>Text</h3>
        <p>
          The map is committed to representing many of the smaller, minority,
          and Indigenous languages that are primarily oral and have neither
          public visibility nor official support. It represents ELA’s ongoing
          effort to draw on all available sources, including thousands of
          interviews and discussions, to tell the continuing story of the city’s
          many languages and cultures. The patterns it reveals — the clustering
          of West African languages in Harlem and the Bronx, a microcosm of the
          former Soviet Union in south Brooklyn, the multifaceted Asian-language
          diversity of Queens, to name a few — only hint at the linguistic
          complexity of a city where a single building or block can host
          speakers of dozens of languages from across the globe.
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
      <Paper>
        <h3>Lists</h3>
        <h4>Ordered</h4>
        <ol>
          <li>Ok man</li>
          <li>Here is</li>
          <li>List item</li>
        </ol>
        <h4>Unordered</h4>
        <ul>
          <li>Ok man</li>
          <li>Here is</li>
          <li>List item</li>
        </ul>
      </Paper>
      <Paper>
        <h3>Code</h3>
        <pre>{fakeCode}</pre>
      </Paper>
    </div>
  )
}

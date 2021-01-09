<p align="center">
  <a href="https://map.languagemapping.org/" target="_blank" title="Project website">
    <img alt="logo" src="src/img/logo.svg" width="320" />
  </a>
</p>

# Languages of New York City Map

[![Netlify Status](https://api.netlify.com/api/v1/badges/1f8bbbc8-4747-415e-bc63-b392256cedd5/deploy-status)](https://app.netlify.com/sites/languagemapping/deploys)

> This project will become an interactive map of New York City’s linguistic
> diversity, using data collected by the Endangered Language Alliance (ELA).
> Users will need to be able to query a rich dataset and interact with the data
> through an interactive map that may consist of audio, video, and storymap
> links. The long-term vision for this project is to create an open source
> toolkit documenting the workflows and tools used to enable others to undertake
> language mapping in their own communities.

## Setup and requirements

This project was bootstrapped with [Create React
App](https://github.com/facebook/create-react-app) with `--typescript`. In order
to develop it, you will need a few items.

### Software

In order to use this project locally, you must have:

- [Node.js](https://nodejs.org/)
- [`yarn` package manager](https://yarnpkg.com/)

Setup and installation steps are available on each website.

### Mapbox API key

In order to use Mapbox features including background layers, vector tiles, and
place search, follow these steps:

1. [Create a Mapbox account](https://account.mapbox.com/auth/signup/) if needed.
2. [Create an access
   token](https://docs.mapbox.com/accounts/overview/tokens/#creating-and-managing-access-tokens).
3. Create a file called _.env_ in this directory.
4. Add the following to it, replacing `YOUR_TOKEN` with the Mapbox token you
   just created:
   ```bash
   REACT_APP_MB_TOKEN='YOUR_TOKEN'
   ```

**TODO:** document `REACT_APP_MB_SECRET` or whatever for secret scope (aka
fetching stuff, not MB GL access).

### Airtable

~~This project uses Google Sheets~~ **Airtable** to store much of the config and
some data for the project.

**TODO: update this whole section with Airtable instructions.**

### YouTube API

The project is set up to support YouTube embed URLs (for both playlists and
individual videos) and Internet Archive embed URLs. If using YouTube, follow the
same instructions as the Google Sheets API instructions above, but set the
variable name as `REACT_APP_YOUTUBE_API_KEY`.

The API is only used for metadata like title and descriptions. You can still
embed videos without an API key, and Internet Archive's API does not require a
key at all.

### Sentry

TODO: decide how/whether to explain Netlify, Sentry situation. If including
Sentry, need to follow the React steps from their docs. If following same setup
as ours, set the Sentry environment via `REACT_APP_SENTRY_ENVIRONMENT` env var.

## Usage

### Install dependencies

In the project directory, run `yarn` to install the project's `npm`
dependencies. It should take a lot less time to install after the first run.

### Develop

In the project directory, run `yarn start` to run the app in a local web server
visible at[http://localhost:3000](http://localhost:3000).

The page will automatically reload if you make edits. You will also see any lint
errors in the console.

#### SSL (https)

If you prefer `https`, sans scary red warning in the browser, use a tool like
`mkcert` and add these to your _.env_ file using its output:

```bash
HTTPS=true
SSL_CRT_FILE=/The/Path/To/Your/Certificates/cert.pem
SSL_KEY_FILE=/The/Path/To/Your/Certificates/key.pem
```

Steps may vary by OS but there are a lot of tutorials online. Just do a search
for "create-react-app ssl" or similar.

### Test

`yarn test` launches the test runner in the interactive watch mode. See the
section about [running
tests](https://facebook.github.io/create-react-app/docs/running-tests) for more
information.

### Build

`yarn build` builds the app for production in a _./build_ folder in this
directory. It bundles React in production mode and optimizes the build for the
best performance. The build is minified and the filenames include cache-busting
hashes. Your app is ready to be deployed!

See the section about
[deployment](https://facebook.github.io/create-react-app/docs/deployment) for
more information.

#### To build with Profiling enabled

...in case you want to profile your production build (dev builds will be misleadingly large).

CRED: [Kent's article](https://kentcdodds.com/blog/profile-a-react-app-for-performance#build-and-measure-the-production-app)

```bash
npx react-scripts build --profile
```

And then serve it from the _./build_ directory:

```bash
# The -l 3000 is optional to set port, which defaults to 5000
npx serve -s build -l 3000
```

### View Style Guide Demo

To better visualize UI styles, theming, and layout, you can see examples of
common DOM elements and components at the `/style-guide` endpoint in any
instance of the project (e.g. locally at `http://localhost:3000/style-guide` or
in production at `https://languagemapping.netlify.app/style-guide`).

## Learn More

You can learn more in the [Create React App
documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Software Credits

- Anything in _package.json_

## Data

### Census data

...was obtained using the following steps. **Note that this does not apply to
anyone who is not using Mapbox Boundaries** as you need that service and the
corresponding lookup tables for this to be relevant. There may be a way to do
[something similar using
`citysdk`](https://uscensusbureau.github.io/citysdk/examples/mapbox-choropleth/)
and ArcGIS.

<!-- TODO: adapt and rm as needed -->

#### Mapbox lookup tables

**DEPRECATED: no longer using Boundaries for census, custom tileset instead**.
Removed after `b9086b0`.

Whittled down MB lookup tables for `boundaries-sta4-v3-US`. Combination of CSV,
GeoJSON, spreadsheets to make formulas for creating lat/lng for QGIS temporary
use. Resulting schema:

```json
[{ "id": 3125098729, "fips": "36005000100" }]
```

Note `id` instead of MB's `feature_id` for brevity. The `fips` field is from
2-char state code + 3-char county + 6-char tract and serves as the foreign key
by which to join data from the Census API.

#### Census API

...was hit using the `citysdk` lib using this config:

```js
const censusLangFields = [
  'Age5p_Arabic_ACS_13_17',
  'Age5p_Chinese_ACS_13_17',
  'Age5p_French_ACS_13_17',
  'Age5p_German_ACS_13_17',
  'Age5p_Korean_ACS_13_17',
  'Age5p_Russian_ACS_13_17',
  'Age5p_Spanish_ACS_13_17',
  'Age5p_Tagalog_ACS_13_17',
  'Age5p_Vietnamese_ACS_13_17',
]

const pdbConfig = {
  vintage: 2019,
  geoHierarchy: {
    state: '36', // NY = 36
    county: '085,047,081,061,005',
    tract: '*',
  },
  sourcePath: ['pdb', 'tract'],
  values: censusLangFields,
}
```

This includes the 5-county area (Richmond, Kings, Queens, New York, Bronx) and
the `censusLangFields` columns (aka "variables in Census API). It returns ~2100
records, which were manually copied using `console.copy()`, then looped over and
"joined" against the MB lookup's `fips` column. Note that instead of `NaN` the
`citysdk` tool returns a `'NAN: null'` string for empty values (`0` is not
empty).

There were only 5 records which didn't match:

```
36047990100 36061000100 36081990100 36085008900 36085990100
```

but this may have been a result of incorrect lookup whittling. Will look into.

#### Result

The result of the manicured join is a custom schema like so:

```json
{
  "id": 3125098729,
  "fips": "36005000100",
  "Arabic": 29,
  "Chinese": 24,
  "French": 53,
  "German": 7,
  "Korean": 3,
  "Russian": 46,
  "Spanish": 1233,
  "Tagalog": 0,
  "Vietnamese": 0
}
```

So far this being committed to the repo but obviously this is not an ideal soln.

## TODOs

### Fonts documentation

1. How it all works
2. MB Studio uploads vs. UI
3. Truly img-only instances (ASL, maybe Mongolian, etc.) w/SVG fallback
4. If it works: `@font-face` in CSS, and using it in _theme.ts_.
5. Relationship betwee img-only (the dataset col) and how code checks for it: if `Font Image Alt` is empty then use Endonym, otherwise use img. Places in code that use this: Details, table, popups, tooltips (others?)
6. Probably something I'm missing.

### Development

Set up [quicker debugging](https://code.visualstudio.com/updates/v1_48#_debug-open-link-command).

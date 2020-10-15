# Languages of New York City Map

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

### Google Sheets API

This project uses Google Sheets to store the config for the dozens of languages
whose endonyms rely on custom fonts (uploaded manually to the Mapbox account
used above) in order to render properly as labels in the map.

In order for the config to be accessible:

1. Obtain an API key. The detailed steps will not be outlined here since they
   are long and Google procedures may change over time, but you can find a
   decent breakdown in [this
   comment](https://github.com/Language-Mapping/language-map/issues/18#issuecomment-692983114)
   and the gist is that you **need a Google API key**.
2. Once you have obtained it, add the following to the _.env_ file described
   above, replacing `YOUR_KEY` with the one you just created:
   ```bash
   REACT_APP_GOOGLE_API_KEY='YOUR_KEY'
   ```
3. Create a Google Sheet with two columns: `Language` and `Font`. The former
   will contain values matching those in the `Language` column of the main
   dataset, and the latter the full font name, such as `Noto Sans Myanmar Regular`.

You should not need to publish the sheet nor set any permissions in order to use
it since you should have full read access to it via the API. If you are getting
any permissions errors though, that would be the first place to check.

### YouTube API

The project is set up to support YouTube embed URLs (for both playlists and
individual videos) and Internet Archive embed URLs. If using YouTube, follow the
same instructions as the Google Sheets API instructions above, but set the
variable name as `REACT_APP_YOUTUBE_API_KEY`.

The API is only used for metadata like title and descriptions. You can still
embed videos without an API key, and Internet Archive's API does not require a
key at all.

## Usage

### Install dependencies

In the project directory, run `yarn` to install the project's `npm`
dependencies. It should take a lot less time to install after the first run.

### Develop

In the project directory, run `yarn start` to run the app in a local web server
visible at[http://localhost:3000](http://localhost:3000).

The page will automatically reload if you make edits. You will also see any lint
errors in the console.

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
- [Country flags](https://github.com/hjnilsson/country-flags)

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

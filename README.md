# NYC Linguistic Diversity Map

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

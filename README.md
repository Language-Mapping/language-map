<p align="center">
  <a href="https://languagemap.nyc/" target="_blank" title="Project website">
    <img alt="logo" src="src/img/logo.svg" width="320" />
  </a>
</p>

# Languages of New York City Map

[![Netlify
Status](https://api.netlify.com/api/v1/badges/1f8bbbc8-4747-415e-bc63-b392256cedd5/deploy-status)](https://app.netlify.com/sites/languagemapping/deploys)

## Background

> This project will become an interactive map of New York City’s linguistic
> diversity, using data collected by the Endangered Language Alliance (ELA).
> Users will need to be able to query a rich dataset and interact with the data
> through an interactive map that may consist of audio, video, and storymap
> links. The long-term vision for this project is to create an open source
> toolkit documenting the workflows and tools used to enable others to undertake
> language mapping in their own communities.

## Additional resources

View our [Google Drive documentation
folder](https://drive.google.com/drive/u/1/folders/1OKVEZM_ossYa6E2djXpA4yTHCucu5D83)
for additional resources, especially in regards to GIS workflows.

## Dev setup and requirements

This project was bootstrapped with [Create React
App](https://github.com/facebook/create-react-app) with `--typescript`. In order
to develop it, you will need a few items.

### Software

In order to use this project locally, you must have:

- [Node.js](https://nodejs.org/). Version is not specific but code was written
  using `v14.15.4`.
- [`yarn` package manager](https://yarnpkg.com/)

Setup and installation steps are available on each website.

### Accounts setup

#### Mapbox

In order to use Mapbox ("MB") features including background layers, vector
tiles, and place search, follow these steps:

1. [Create a Mapbox account](https://account.mapbox.com/auth/signup/) if needed.
2. [Create an access
   token](https://docs.mapbox.com/accounts/overview/tokens/#creating-and-managing-access-tokens).

#### Airtable

This project uses **Airtable** to store much of the config and most of the
project data. Your setup will need to match ours, or you'll want to edit the
code to your needs. Get an [API
key](https://support.airtable.com/hc/en-us/articles/219046777-How-do-I-get-my-API-key-)
either way.

#### YouTube API (optional)

The project is set up to support YouTube embed URLs (for both playlists and
individual videos) and Internet Archive embed URLs. If using YouTube, get an
[API key](https://developers.google.com/youtube/v3/getting-started).

The API is only used for metadata like title and descriptions. You can still
embed videos without an API key, and Internet Archive's API does not require a
key at all.

If you are not using YouTube's API, search the project for references to it and
remove as needed.

#### Sentry (optional)

If using Sentry error tracking, follow the React steps from their docs. If not,
search the project for Sentry references and remove them.

#### Netlify (optional)

We are hosting/deploying with **Netlify**. If you are using it, edit the
_netlify.toml_ file in this directory accordingly, otherwise delete it. If not
using Sentry, remove that part from the file.

### Environment

After setting up accounts above:

1. Rename the _sample.env_ file in this directory to _.env_.
2. Follow instructions inside the file using your account info.

## Data

See details in [docs/data_structure.md](this file).

## Fonts

### Mapbox fonts

1. Create
2. Upload any custom fonts you need for endonym labels to Mapbox.
3. Make sure they are set with corresponding values in the Airtable `Fonts` and
   `Language` tables.

### UI fonts

Not all fonts in the map render incorrectly in the UI, and vice versa. If you
need to add/edit UI fonts, do so in:

- _public/index.html_
- _src/components/config/fonts.ts_
- _src/components/style.css_ (only for one problematic font so far)

Some fonts may not have a script at all, e.g. ASL. Upload these as an image to
the `Font Image Alt` field of the `Language` table.

## MB Studio Styles

Create three Styles in MB Studio with light and dark basemaps, and one with just
a darker background. These are used by the basemap switcher. Publish the styles,
make them public, and update the relevant spots in
_src/components/map/config.ts_ using their IDs.

## Dev Usage

### Install dependencies

In the project directory, run `yarn` to install the project's `npm`
dependencies. It should take a lot less time to install after the first run.

### Develop

In the project directory, run `yarn start` to run the app in a local web server
visible at [http://localhost:3000](http://localhost:3000).

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

...in case you want to profile your production build (dev builds will be
misleadingly large).

CRED: [Kent's
article](https://kentcdodds.com/blog/profile-a-react-app-for-performance#build-and-measure-the-production-app)

```bash
npx react-scripts build --profile
```

And then serve it from the _./build_ directory:

```bash
# The -l 3000 is optional to set port, which defaults to 5000
npx serve -s build -l 3000
```

### Learn More

You can learn more in the [Create React App
documentation](https://facebook.github.io/create-react-app/docs/getting-started).
To learn React, check out the [React documentation](https://reactjs.org/).

## Software Credits

- Every dependency is open-source. View _package.json_ for a list.
- [Country flags](https://github.com/hjnilsson/country-flags) are the source for
  the images we uploaded to Airtable.

## Contribution

See the [organization repo](https://github.com/Language-Mapping/.github) for
details.

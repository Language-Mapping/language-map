// TODO: rm if only using local, otherwise restore when ready
// const MB_STYLES_API_URL = 'https://api.mapbox.com/styles/v1'

export const MAPBOX_TOKEN = process.env.REACT_APP_MB_TOKEN
export const mbStyleTileConfig = {
  // NOTE: Draft does NOT seem to be reliable or real-time
  // styleUrl: 'elalliance/ckcmivm0r1o491iomlji26c48/draft',
  // TODO: rm if only using local, otherwise restore when ready
  // styleUrl: 'elalliance/ckcmivm0r1o491iomlji26c48',
  // TODO: ^^^ consider local URL, at least during dev ^^^
  symbStyleUrl: '/data/mb-styles.langs.json',
  layerId: 'languages-08ip3e',
  tilesetId: 'elalliance.d0yv450e',
  internalSrcID: 'languages-src', // arbitrary, set in code, never changes
}

// TODO: rm if only using local, otherwise restore when ready
// export const symbStyleUrl = `${MB_STYLES_API_URL}/${mbStyleTileConfig.styleUrl}?access_token=${MAPBOX_TOKEN}`
// Unsure why it needs the type here but not for feature coords..
const mapCenter = [-73.96, 40.7128] as [number, number]
export const initialMapState = {
  latitude: mapCenter[1],
  longitude: mapCenter[0],
  zoom: 5,
}

// After the `fitBounds` happens and gets all the features into state
export const postLoadInitMapStates = {
  desktop: {
    lat: 40.7186,
    lng: -73.9079,
    zoom: 10.76,
  },
  mobile: {
    lat: 40.7293,
    lng: -73.9059,
    zoom: 9.39,
  },
}

// TODO: rm when done
// Australia and New Zealand - 867078 // formerly oceania
// Caribbean - 55b4a3
// Central America - 4e7bbc
// Central Asia - c29e49
// Eastern Africa - d64699
// Eastern Asia - dc6d3a
// Eastern Europe - 88c64c
// Melanesia - 72493b
// Micronesia - 72493b
// Middle Africa - 684984
// Northern Africa - da84b7
// Northern America - 465192
// Northern Europe - 295e5b
// Polynesia - 72493b
// South America - 3fb4ce
// Southeastern Asia - 96302e
// Southern Africa - 846caf
// Southern Asia - dd3939
// Southern Europe - 7ca298
// Western Africa - 9b4899
// Western Asia - 97a853
// Western Europe - 397439

// Looks handy?
// https://api.mapbox.com/v4/elalliance.d0yv450e.json?secure&access_token=pk.eyJ1IjoiZWxhbGxpYW5jZSIsImEiOiJja2M1Nmd6YnYwZXQ4MnJvYjd6MnJsb25lIn0.AC_4h4BmJCg2YvlygXzLxQ

// For icons? Fonts?
// https://github.com/mapbox/tiny-sdf

// Other color palette options
// https://github.com/Siddharth11/Colorful

// STYLE
// https://api.mapbox.com/styles/v1/elalliance/ckcmivm0r1o491iomlji26c48?access_token=pk.eyJ1IjoiZWxhbGxpYW5jZSIsImEiOiJja2M1Nmd6YnYwZXQ4MnJvYjd6MnJsb25lIn0.AC_4h4BmJCg2YvlygXzLxQ

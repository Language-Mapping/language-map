// NYC: [-73.96, 40.7128]
// Unsure why it needs the type here but not for feature coords..
const mapCenter = [-73.96, 40.7128] as [number, number]

export const initialMapState = {
  latitude: mapCenter[1],
  longitude: mapCenter[0],
  zoom: 10,
  // TODO: restore when makes sense to
  // bearing,
  // pitch,
}

export const langSrcConfig = {
  // layerId: 'langsNY_06242020-6lpxtk', // original
  // tilesetId: 'elalliance.1bsrluyq', // original
  layerId: 'languages-08ip3e', // newer (long-term dev?)
  tilesetId: 'elalliance.d0yv450e', // newer (long-term dev?)
  internalSrcID: 'languages-src', // arbitrary, set in code, never changes
}

// TODO: extract AES from Studio, back up somewhere, then rm from Studio
// Use dev/prod tilesetup
export const langLayerConfig = {
  // styleUrl: 'elalliance/ckcmivm0r1o491iomlji26c48', // original "prod"
  // TODO: consider local URL?
  styleUrl: 'elalliance/ckcmivm0r1o491iomlji26c48/draft',
}

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
  layerId: 'langsNY_06242020-6lpxtk',
  tilesetId: 'elalliance.1bsrluyq',
  internalSrcID: 'languages-src',
}

export const langLayerConfig = {
  styleUrl: 'elalliance/ckcmivm0r1o491iomlji26c48/draft',
}

export const langLabelsConfig = {
  styleUrl: 'elalliance/ckcmj5ex61oka1ir0q9q82tmf/draft',
}

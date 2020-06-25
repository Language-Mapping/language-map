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

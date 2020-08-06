import { PaddingOptions } from 'mapbox-gl'

// One of the problems of using panels which overlap the map is how to deal with
// "centering", in quotes because it's more "perceived" centering. Offset is
// needed to make a panned-to selected feature centered between the header and
// panel (on mobile) or between the panel and the right side (on desktop).
export const prepMapPadding = (
  isDesktop: boolean,
  topBarElemID = 'page-header',
  mapPanelsElemeID = 'map-panels-wrap'
): PaddingOptions => {
  const topBarElem = document.getElementById(topBarElemID)
  const topBarHeight = topBarElem ? topBarElem.offsetHeight : 60
  const defaults = {
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  }

  if (!isDesktop) {
    return {
      ...defaults,
      bottom: window.screen.height / 4 + topBarHeight * 2,
    }
  }

  const sidePanelElem = document.getElementById(mapPanelsElemeID)
  const sidePanelWidth = sidePanelElem ? sidePanelElem.scrollWidth : 60
  const sidePanelGutter = sidePanelElem ? sidePanelElem.offsetLeft : 16

  return {
    ...defaults,
    left: sidePanelWidth + sidePanelGutter,
    top: topBarHeight,
  }
}

import React from 'react'
import { FaSearch } from 'react-icons/fa'
import { FiLayers } from 'react-icons/fi'
import { TiDocumentText, TiThList } from 'react-icons/ti'

export const panelsConfig = [
  {
    heading: 'Explore',
    subheading: 'Searching, filtering, etc.',
    icon: <FaSearch />,
    component: (
      <p>
        This panel would be shown first since it is what we want the user to see
        before diving into anything else.
      </p>
    ),
  },
  {
    heading: 'Layers',
    subheading: 'Symbology + label controls',
    icon: <FiLayers />,
    component: (
      <p>
        Much more room here than layers popout menu via button over map. Will
        allow for seeing most or all of the legend 24/7 without scrolling
      </p>
    ),
  },
  {
    heading: 'Results',
    subheading: 'Table or list of results',
    icon: <TiThList />,
    component: (
      <p>
        Not a ton of room here, should other options be considered? Might be
        cool as a "Grid View" too.
      </p>
    ),
  },
  {
    heading: 'Details',
    subheading: '...of selected feature',
    icon: <TiDocumentText />,
    component: (
      <p>
        Detailed info on a specific selected individual point. Will be triggered
        by clicking a record in Results panel or a "View Details" button from
        within a popup when a point is clicked in the map.
      </p>
    ),
  },
]

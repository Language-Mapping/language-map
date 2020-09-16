// `Status` icons
import iconTree from './icons/tree.svg'
import iconBook from './icons/book.svg'
import iconUsers from './icons/users.svg'
import iconHome from './icons/home.svg'
import iconMuseum from './icons/museum.svg'

export const langTypeIconsConfig = [
  { icon: iconTree, id: '_tree' },
  { icon: iconBook, id: '_book' },
  { icon: iconUsers, id: '_users' },
  { icon: iconHome, id: '_home' },
  { icon: iconMuseum, id: '_museum' },
]

export const langLabelsStyle = {
  layout: {
    'text-variable-anchor': ['bottom-left', 'top-left'],
    'text-radial-offset': 0,
    'text-field': ['to-string', ['get', 'Language']],
    'text-font': ['Noto Sans Regular', 'Arial Unicode MS Regular'],
    'text-size': 10,
  },
  paint: {
    'text-color': 'hsl(0, 0%, 5%)',
    'text-halo-width': 1,
    'text-halo-color': 'hsla(0, 0%, 95%, 0.95)',
  },
}

// For icons? Fonts? https://github.com/mapbox/tiny-sdf
// Other color palette options: // https://github.com/Siddharth11/Colorful

// STYLE
// https://api.mapbox.com/styles/v1/elalliance/ckcmivm0r1o491iomlji26c48?access_token=pk.eyJ1IjoiZWxhbGxpYW5jZSIsImEiOiJja2M1Nmd6YnYwZXQ4MnJvYjd6MnJsb25lIn0.AC_4h4BmJCg2YvlygXzLxQ

// Looks handy?
// https://api.mapbox.com/v4/elalliance.d0yv450e.json?secure&access_token=pk.eyJ1IjoiZWxhbGxpYW5jZSIsImEiOiJja2M1Nmd6YnYwZXQ4MnJvYjd6MnJsb25lIn0.AC_4h4BmJCg2YvlygXzLxQ

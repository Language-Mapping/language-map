export type RouteLocation =
  | '/'
  | '/Census'
  | '/Census/:table/:field/:id'
  | '/Census/puma/:field/:id'
  | '/Census/tract/:field/:id'
  | '/Explore'
  | '/Explore/:field'
  | '/Explore/:field/:value'
  | '/Explore/Language/:language'
  | '/Explore/Language/:value/:id'
  | '/Explore/Language/none' // reserved, aka "No community selected"
  | '/Explore/Neighborhood'
  | '/Explore/County'
  | '/Info'
  | '/Info/About'
  | '/Info/Feedback'
  | '/Info/Help'
  | '/table'
  | '/table/:id'
// TODO: ^^^^ figure out why it's not actually checking

export type LocWithState = {
  pathname: string
  state: { from?: string }
  hash?: string
}

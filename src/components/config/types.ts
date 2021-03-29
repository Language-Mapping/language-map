export type RouteLocation =
  | '/'
  | '/Census'
  | '/Explore'
  | '/Explore/:field'
  | '/Explore/:field/:value'
  | '/Explore/:field/:value/:language'
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

export type RouteLocation =
  | '/'
  | '/Census'
  | '/details'
  | '/Explore'
  | '/Explore/:field'
  | '/Explore/:field/:value'
  | '/Info'
  | '/Info/About'
  | '/Info/Feedback'
  | '/Info/Help'
  | '/table'
// TODO: ^^^^ figure out why it's not actually checking

export type LocWithState = {
  pathname: string
  state: { from?: string }
  hash?: string
}

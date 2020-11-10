export type RouteLocation =
  | '/'
  | '/details'
  | '/table'
  | '/about'
  | '/help'
  | '/Explore'
  | '/Explore/:field'
  | '/Explore/:field/:value'
// TODO: ^^^^ figure out why it's not actually checking

export type LocWithState = {
  pathname: string
  state: { from?: string }
}

export type RouteLocation =
  | '/'
  | '/details'
  | '/table'
  | '/about'
  | '/help'
  | '/spatial'
  | '/Explore'
  | '/Explore/:field'
  | '/Explore/:field/:value'
// TODO: ^^^^ figure out why it's not actually checking

export type LocWithState = {
  pathname: string
  state: { from?: string }
  hash?: string
}

export type ReactQueryStatus = { isLoading: boolean; error: Error }
export type ArrayOfStringArrays = [string[]]
// TODO: deal w/google's built-in `data.error` (adjust TS first)
export type RawSheetsResponse = { values: ArrayOfStringArrays }

export type SheetsReactQueryResponse = {
  data: RawSheetsResponse
  error: Error
  isLoading: boolean
}

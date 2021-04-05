export type WpApiPageResponse = {
  title: {
    rendered: string
  }
  content: {
    rendered: string
  }
}

export type RemoteContentState = {
  title: string | null
  content: string | null
}

export type WpQueryKeys = 'about' | 'help'

export type AboutPageProps = {
  queryKey: number
  title?: string
}

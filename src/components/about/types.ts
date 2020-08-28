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

export type WpQueryNames = 'about' | 'glossary' | 'welcome'

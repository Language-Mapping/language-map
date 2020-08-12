export type WpApiPageResponse = {
  title: {
    rendered: string
  }
  content: {
    rendered: string
  }
}

export type AboutPageState = {
  title: string | null
  content: string | null
}

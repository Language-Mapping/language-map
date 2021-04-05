export type UItextTableID =
  | 'census-panel-intro-bottom'
  | 'census-panel-intro-top'
  | 'census-popout-intro'
  | 'census-search-helper'
  | 'census-search-placeholder'
  | 'census-search-puma-heading'
  | 'census-search-tract-heading'
  | 'census-vintage'
  | 'details-neighb-loc-list'
  | 'feedback-details-text'
  | 'info-link--about'
  | 'info-link--contact-feedback'
  | 'info-link--help'
  | 'info-link--user-manual'
  | 'lang-profile-loc-list'
  | 'loc-search-placeholder'
  | 'map-menu-baselayers'
  | 'map-menu-counties'
  | 'map-menu-geoloc'
  | 'map-menu-neighbs'
  | 'neighb-loc-list'
  | 'omni-placeholder'

export type UseUItext = {
  error: unknown
  isLoading: boolean
  text: string
}

export type UItextFromAirtableProps = {
  id: UItextTableID
  rootElemType?: MarkdownRootElemType
}

export type LinkRenderer = {
  href: string
  node: { children: { value: string }[] }
}

export type MarkdownRootElemType = 'p' | 'span' | 'div'

export type ToggleWithHelperProps<TChange = React.Dispatch<unknown>> = {
  label: string
  name: string
  handleChange: TChange
  checked?: boolean
  helperText?: React.ReactNode
}

export type UItextTableID =
  | 'census-panel-intro'
  | 'census-popout-intro'
  | 'census-search-helper'
  | 'census-search-placeholder'
  | 'details-neighb-loc-list'
  | 'feedback-details-text'
  | 'info-link--about'
  | 'info-link--contact-feedback'
  | 'info-link--help'
  | 'info-link--user-manual'
  | 'lang-profile-loc-list'
  | 'loc-search-placeholder'
  | 'neighb-loc-list'
  | 'omni-placeholder'

export type UseUItext = {
  error: unknown
  isLoading: boolean
  text: string
}

export type UItextFromAirtableProps = {
  id: UItextTableID
}

export type LinkRenderer = {
  href: string
  node: { children: { value: string }[] }
}

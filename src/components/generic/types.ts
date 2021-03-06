export type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'huge' | 'tablet'
export type UItextTableID =
  | 'call-to-action'
  | 'census-panel-intro-bottom'
  | 'census-panel-intro-top'
  | 'census-popout-intro'
  | 'census-search-helper'
  | 'census-search-placeholder'
  | 'census-search-puma-heading'
  | 'census-search-tract-heading'
  | 'census-vintage'
  | 'details-neighb-loc-list'
  | 'explore-intro'
  | 'feedback-details-text'
  | 'info-link--about'
  | 'info-link--contact-feedback'
  | 'info-link--help'
  | 'info-link--user-manual'
  | 'lang-profile-loc-list'
  | 'loc-search-info-popout'
  | 'loc-search-placeholder'
  | 'map-menu-baselayers'
  | 'map-menu-counties'
  | 'map-menu-geoloc'
  | 'map-menu-neighbs'
  | 'neighb-loc-list'
  | 'none-selected'
  | 'omni-info-popout'
  | 'omni-placeholder'
  | 'table-info-btn'
  | 'welcome-dialog'

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

export type SimplePopoverProps = {
  content: string | React.ReactNode
  icon?: React.ReactNode
}

export type PopoverWithUItextProps = {
  id: UItextTableID
}

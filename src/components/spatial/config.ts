// TODO: if using uploaded census layer instead of Boundaries, obtain these
// directly from column headings instead (assuming pretty column names)
// TODO: confirm don't need English or "Other"
export const censusLangFields = [
  'Arabic',
  'Chinese',
  'French',
  'German',
  'Korean',
  'Russian',
  'Spanish',
  'Tagalog',
  'Vietnamese',
]

// `exponential` was bad w/given data, and `step`
export const ratesOfChange = ['exponential', 'linear', 'cubic-bezier']

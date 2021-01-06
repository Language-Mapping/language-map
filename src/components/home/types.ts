import { LangLevelSchema } from 'components/context/types'

export type PreppedAutocompleteGroup = Pick<
  LangLevelSchema,
  'name' | 'Endonym' | 'Glottocode' | 'ISO 639-3'
> & {
  id: string
  location: string
}

import { ColumnsConfig } from './types'

export const columns = [
  { title: 'Language', field: 'Language' },
  { title: 'Endonym', field: 'Endonym' },
  { title: 'Neighborhoods', field: 'Neighborhoods' },
  { title: 'Community Size', field: 'Community Size' },
  { title: 'Type', field: 'Type' },
  { title: 'World Region', field: 'World Region' },
  { title: 'Countries', field: 'Countries' },
  { title: 'Global Speaker Total', field: 'Global Speaker Total' },
  { title: 'Language Family', field: 'Language Family' },
  // { title: 'Description', field: 'Description' }, // TODO: restore/truncate
  // TODO: adapt and restore
  // {
  //   title: 'Birth Year',
  //   field: 'birthYear',
  //   type: 'numeric',
  // },
  // {
  //   title: 'Birth Place',
  //   field: 'birthCity',
  //   lookup: { 34: 'İstanbul', 63: 'Şanlıurfa' },
  // },
] as ColumnsConfig[]

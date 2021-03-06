import { OutlinedTextFieldProps } from '@material-ui/core'

import { InstanceLevelSchema } from 'components/context/types'
import { AtSymbFields } from './types'

export const commonSelectProps = {
  fullWidth: true,
  select: true,
  size: 'small',
  InputLabelProps: { disableAnimation: true, focused: true },
  SelectProps: { native: true },
} as OutlinedTextFieldProps

// TODO: TS
// type Wow = keyof Partial<InstanceLevelSchema>
// type SymbFields = { [key in Wow]: string[] }

export const layerSymbFields = {
  'World Region': ['icon-color', 'text-color', 'text-halo-color', 'continent'],
  Status: ['icon-color', 'icon-image', 'src_image', 'label'],
  Size: ['icon-color', 'icon-size', 'value', 'label'],
} as { [key in keyof Partial<InstanceLevelSchema>]: (keyof AtSymbFields)[] }

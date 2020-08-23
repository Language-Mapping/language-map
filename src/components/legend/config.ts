import { OutlinedTextFieldProps } from '@material-ui/core'

export const commonSelectProps = {
  select: true,
  size: 'small',
  InputLabelProps: { disableAnimation: true, focused: true },
  SelectProps: { native: true },
} as OutlinedTextFieldProps

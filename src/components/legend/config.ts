import { OutlinedTextFieldProps } from '@material-ui/core'

export const commonSelectProps = {
  fullWidth: true,
  select: true,
  size: 'small',
  InputLabelProps: { disableAnimation: true, focused: true },
  SelectProps: { native: true },
} as OutlinedTextFieldProps

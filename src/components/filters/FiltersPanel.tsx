import React, { FC, useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import {
  Link,
  InputLabel,
  FormHelperText,
  FormControl,
  NativeSelect,
} from '@material-ui/core'
import { FaQuestionCircle } from 'react-icons/fa'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    defsModalTrigger: {
      alignItems: 'center',
      color: theme.palette.info.main,
      display: 'flex',
      fontSize: 12,
      justifyContent: 'flex-end',
      marginTop: theme.spacing(1),
      '& > svg': {
        marginRight: 4,
      },
    },
  })
)

export const FiltersPanel: FC = () => {
  const classes = useStyles()
  const [commType, setCommType] = useState<string>('Historical') // TODO: types

  // TODO: for Countries selection:
  // https://material-ui.com/components/autocomplete/#country-select
  return (
    <>
      <Link href="javascript;" className={classes.defsModalTrigger}>
        <FaQuestionCircle />
        What do these mean?
      </Link>
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="comm-type-helper">Type</InputLabel>
        <NativeSelect
          value={commType}
          onChange={(event) => setCommType(event.target.value)}
        >
          <option value="Historical">Historical</option>
          <option value="Liturgical">Liturgical</option>
          <option value="Institutional">Institutional</option>
          <option value="Residential">Residential</option>
          <option value="Reviving">Reviving</option>
        </NativeSelect>
        <FormHelperText>
          How/where the language is currently used
        </FormHelperText>
      </FormControl>
    </>
  )
}

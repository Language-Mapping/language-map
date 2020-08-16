import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

export const useTableStyles = makeStyles((theme: Theme) =>
  createStyles({
    tableRoot: {
      // TODO: rm once horiz. scroll is figured out
      // '& .MuiTable-root': {
      //   minWidth: 750,
      // },
      // Gross way to get the table footer, which has no unique classes
      '& .MuiTable-root:last-of-type': {
        position: 'sticky',
        bottom: 0,
        backgroundColor: theme.palette.common.white,
      },
      '& .MuiTableBody-root': {
        fontSize: '0.85rem',
      },
      '& .MuiToolbar-root .MuiIconButton-label': {
        color: theme.palette.primary.main,
      },
      // e.g. the Filter icon at beginning of column filters
      '& .MuiInputAdornment-root': {
        color: theme.palette.grey[500],
      },
      '& .MuiTableCell-head': {
        fontWeight: 'bold',
        lineHeight: 1.2,
        color: theme.palette.primary.main,
      },
      '& .MuiTableCell-root:not(.MuiTableCell-footer)': {
        padding: `5px 8px 5px 12px`, // this may do nothing if height/width set
        height: 50, // CRED: https://stackoverflow.com/a/25329017/1048518
      },
      '& .MuiTableFooter-root': {
        justifyContent: 'center',
      },
      '& .MuiTablePagination-spacer': {
        display: 'none',
      },
      '& .MuiTablePagination-select': {
        paddingLeft: 0,
      },
      '& .MuiIconButton-label': {
        color: theme.palette.primary.main,
      },
      [theme.breakpoints.down('sm')]: {
        '& .MuiTableFooter-root .MuiIconButton-root': {
          // Waaaaayy too much default padding, can't see on mobile
          padding: 4,
        },
      },
    },
  })
)

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    resultsModalRoot: {
      '& .MuiDialog-paper': {
        overflowY: 'hidden',
      },
      '& .MuiPaper-root': {
        overflowY: 'hidden',
      },
      // Don't even know what this is, some kind of spacer or something to do
      // with grouping perhaps (even though it's set to `false` in the table
      // options), but either way itseems useless.
      '& > div.MuiDialog-container.MuiDialog-scrollPaper > div > div > div:nth-child(2) > div:nth-child(1)': {
        display: 'none',
      },
      // Gross way to get the table footer, which has no unique classes
      '& .MuiPaper-root > .MuiTable-root': {
        position: 'sticky',
        bottom: 0,
      },
      '& .MuiTableBody-root': {
        fontSize: '0.8rem',
      },
      // e.g. the Filter icon at beginning of column filters
      '& .MuiInputAdornment-root': {
        color: theme.palette.grey[500],
      },
      // Column headings
      '& .MuiTableCell-head': {
        fontWeight: 'bold',
        lineHeight: 1.2,
        color: theme.palette.primary.main,
      },
      // Default cushion of non-dense table cell is 16px
      '& .MuiTableCell-root': {
        padding: '12px 10px',
      },
      // Pagination
      '& .MuiTableCell-footer': {
        padding: 0, // may have no impact when height is set
        // height: 50, // but height is needed in order to establish a minHeight
        // CRED: https://stackoverflow.com/a/25329017/1048518
      },
      // The table footer
      '& .MuiTableFooter-root': {
        justifyContent: 'center',
        background: theme.palette.common.white,
        borderTop: `solid 1px ${theme.palette.grey[400]}`,
      },
      '& .MuiTablePagination-spacer': {
        display: 'none',
      },
      '& .MuiTablePagination-select': {
        paddingLeft: 0,
      },
      // All icons in and out of table. Icons inherit color and size from it.
      '& .MuiIconButton-root': {
        padding: theme.spacing(1),
        fontSize: '1.4rem',
      },
      // ...otherwise it overrides the `disabled` Action buttons
      '& .MuiIconButton-root:not([disabled])': {
        color: theme.palette.primary.main,
      },
      [theme.breakpoints.down('sm')]: {
        '& .MuiTableFooter-root .MuiIconButton-root': {
          padding: 4, // waaaaayy too much default padding, can't see on mobile
        },
      },
      '& .MuiTableSortLabel-icon': {
        flexShrink: 0, // prevents tiny arrows on columns w/wrapped headings
      },
      // Handy reference for potentially useful selectors
      // '& .MuiTableCell-root:nth-child(2)': {}, // First non-actions column
      // '& .MuiToolbar-root': {}, // top bar title, free actions; footer pag.
    },
    closeBtn: {
      position: 'absolute',
      zIndex: 1,
      top: theme.spacing(1),
      right: theme.spacing(1),
    },
    // Squeeze a bit more room out of the dialog
    resultsModalPaper: {
      marginTop: 0,
      marginBottom: 0,
      maxHeight: `calc(100% - ${theme.spacing(4)}px)`,
    },
  })
)

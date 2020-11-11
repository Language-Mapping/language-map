import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

const footerCell = '.MuiTableCell-footer'
const footerWrap = '.MuiPaper-root > .MuiTable-root'
const headCell = '.MuiTableCell-head'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    resultsModalRoot: {
      [theme.breakpoints.down('sm')]: {
        '& .MuiTableFooter-root .MuiIconButton-root': {
          padding: 4, // waaaaayy too much default padding, can't see on mobile
        },
      },
      // Gross way to get the table footer, which has no unique classes
      [`& ${footerWrap}`]: {
        bottom: 0,
        position: 'sticky',
        [theme.breakpoints.up('sm')]: {
          height: 60, // uggghhhhh
          borderBottomRightRadius: 4,
          borderBottomLeftRadius: 4,
        },
      },
      '& .MuiTableBody-root': {
        fontSize: '0.8rem',
        backgroundColor: theme.palette.background.paper,
      },
      '& .MuiTableHead-root > tr': {
        backgroundColor: theme.palette.background.paper,
      },
      // e.g. the Filter icon at beginning of column filters
      '& .MuiInputAdornment-root': { color: theme.palette.text.hint },
      [`& ${headCell}`]: {
        backgroundColor: 'inherit',
        color: theme.palette.primary.light,
        lineHeight: 1.2,
      },
      // Default cushion of non-dense table cell is 16px
      '& .MuiTableCell-root': { padding: '0.5rem' },
      // Pagination
      [`& ${footerCell}`]: {
        borderBottom: 'none',
        padding: 0, // may have no impact when height is set
        // height: 50, // but height is needed in order to establish a minHeight
        // CRED: https://stackoverflow.com/a/25329017/1048518
      },
      // The table footer
      '& .MuiTableFooter-root': {
        borderTop: `solid ${theme.palette.divider} 2px`,
        boxShadow: theme.shadows[14],
        backgroundColor: theme.palette.background.paper,
        justifyContent: 'center',
      },
      '& .MuiTablePagination-spacer': { display: 'none' },
      '& .MuiTablePagination-select': { paddingLeft: 0 },
      // All icons in and out of table. Icons inherit color and size from it.
      // ...otherwise it overrides the `disabled` Action buttons
      '& table .MuiIconButton-root:not([disabled]), .MuiToolbar-root .MuiIconButton-root:not([disabled])': {
        color: theme.palette.primary.light,
      },
      '& .MuiTableSortLabel-icon': {
        flexShrink: 0, // prevents tiny arrows on columns w/wrapped headings
      },
    },
    closeBtn: {
      position: 'absolute',
      right: '0.4rem',
      top: '0.4rem',
      zIndex: 1,
    },
    // Squeeze a bit more room out of the dialog
    resultsModalPaper: {
      height: `calc(100% - ${theme.spacing(2)}px)`,
      maxHeight: '100%',
      [theme.breakpoints.down('sm')]: {
        height: '100%',
        margin: 0,
      },
      // The wrapper around the wrapper around the wrapper around the table
      '& > .MuiPaper-root > :nth-child(2)': {
        overflow: 'auto',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      },
      '& > .MuiPaper-root > :nth-child(2) > div > div': {
        overflowY: 'unset !important', // forces horiz. scrollbar to show
      },
      '& .MuiPaper-root': {
        display: 'flex',
        height: '100%',
        flexDirection: 'column',
      },
    },
  })
)

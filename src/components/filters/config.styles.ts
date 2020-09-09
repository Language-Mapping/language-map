import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    resultsModalRoot: {
      [theme.breakpoints.down('sm')]: {
        '& .MuiTableFooter-root .MuiIconButton-root': {
          padding: 4, // waaaaayy too much default padding, can't see on mobile
        },
        '& .MuiToolbar-root .MuiIconButton-root': {
          padding: 2,
        },
        // Search bar
        '& .MuiToolbar-root .MuiTextField-root': {
          flexShrink: 1,
          // minWidth: 200,
          // order: 4,
          maxWidth: 150,
        },
        '& [class^=MTableToolbar-spacer]': {
          display: 'none',
        },
        '& .MuiToolbar-root:not(.MuiTablePagination-toolbar)': {
          borderTopLeftRadius: 4,
          borderTopRightRadius: 4,
          // flexWrap: 'wrap',
          // justifyContent: 'space-around',
          // minHeight: 90,
          // padding: theme.spacing(1),
        },
        // Top bar title, free actions; footer pag.
        '& .MuiToolbar-root > :last-child': {
          // marginRight: theme.spacing(1),
        },
      },
      // Not apparent at all screen sizes
      '& .MuiPaper-root': {
        // overflowY: 'hidden',
      },
      // Top bar
      // '& .MuiToolbar-root:not(.MuiTablePagination-toolbar)': {
      //   borderBottom: `solid 1px ${theme.palette.text.hint}`,
      // },
      // Top bar
      // '& .MuiToolbar-root': {
      //   backgroundColor: theme.palette.background.default,
      // },
      // Don't even know what this is, some kind of spacer or something to do
      // with grouping perhaps (even though it's set to `false` in the table
      // options), but either way itseems useless.
      '& > div.MuiDialog-container.MuiDialog-scrollPaper > div > div > div:nth-child(2) > div:nth-child(1)': {
        display: 'none',
      },
      // Gross way to get the table footer, which has no unique classes
      '& .MuiPaper-root > .MuiTable-root': {
        bottom: 0,
        position: 'sticky',
        backgroundColor: theme.palette.background.default,
        borderBottomRightRadius: 4,
        borderBottomLeftRadius: 4,
      },
      '& .MuiTableBody-root': {
        fontSize: '0.8rem',
      },
      // e.g. the Filter icon at beginning of column filters
      '& .MuiInputAdornment-root': {
        color: theme.palette.text.hint,
      },
      // All column headings
      '& .MuiTableCell-head': {
        color: theme.palette.primary.main,
        fontWeight: 'bold',
        lineHeight: 1.2,
      },
      // Actions heading
      '& .MuiTableCell-head:first-of-type': {
        textAlign: 'left !important', // sick of trying to fight the plugin
        // TODO: restore width to 75ish if reinstating "View in map" btn
        width: '10px !important', // sick of trying to fight the plugin
        padding: 0,
      },
      '& .MuiTableBody-root .MuiTableRow-root .MuiTableCell-root:first-of-type': {
        padding: '0 !important',
        width: '10px !important',
      },
      // Default cushion of non-dense table cell is 16px
      '& .MuiTableCell-root': {
        padding: '0.5rem',
      },
      // Pagination
      '& .MuiTableCell-footer': {
        padding: 0, // may have no impact when height is set
        // height: 50, // but height is needed in order to establish a minHeight
        // CRED: https://stackoverflow.com/a/25329017/1048518
      },
      // The table footer
      '& .MuiTableFooter-root': {
        boxShadow: theme.shadows[14],
        justifyContent: 'center',
      },
      '& .MuiTablePagination-spacer': {
        display: 'none',
      },
      '& .MuiTablePagination-select': {
        paddingLeft: 0,
      },
      // All icons in and out of table. Icons inherit color and size from it.
      '& .MuiIconButton-root': {
        // fontSize: '1.4rem', // TODO: rm if not using
      },
      // ...otherwise it overrides the `disabled` Action buttons
      '& table .MuiIconButton-root:not([disabled]), .MuiToolbar-root .MuiIconButton-root:not([disabled])': {
        color: theme.palette.primary.main,
      },
      '& .MuiTableSortLabel-icon': {
        flexShrink: 0, // prevents tiny arrows on columns w/wrapped headings
      },
      // Top bar title, free actions; footer pag.
      // '& .MuiToolbar-root > :last-child': {
      // marginRight: theme.spacing(4),
      // },
      // Handy reference for potentially useful selectors
      // '& table .MuiIconButton-root, .MuiToolbar-root .MuiIconButton-root':{},
      // '& .MuiTableCell-head:not(:first-of-type)': {}, // non-actions headings
      // '& .MuiToolbar-root > :first-child': {}, // top bar title?
      // '& .MuiTableCell-root:first-child': {}, // actions column cells
      // '& .MuiTableCell-root:nth-child(2)': {}, // first non-actions column
      // '& .MuiToolbar-root': {}, // top bar title, free actions; footer pag.
    },
    closeBtn: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      zIndex: 1,
    },
    // Squeeze a bit more room out of the dialog
    resultsModalPaper: {
      maxHeight: `calc(100% - ${theme.spacing(2)}px)`,
      [theme.breakpoints.only('xs')]: {
        // margin: '0 8px',
        maxHeight: '100%',
        margin: 0,
      },
    },
  })
)

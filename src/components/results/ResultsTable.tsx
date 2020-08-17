/* eslint-disable react/display-name */
import React, { FC, useContext } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import MaterialTable from 'material-table'
import { Typography } from '@material-ui/core'
import { GoFile } from 'react-icons/go'
import { FiShare } from 'react-icons/fi'
import { IoMdCloseCircle, IoMdHelpCircle } from 'react-icons/io'
// TODO: rm when settled
// import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon'
import { TiThList } from 'react-icons/ti'

import { GlobalContext } from 'components'
import * as config from './config'
// TODO: wire up
// import { RecordDescription } from './RecordDescription'
import { useWindowResize } from '../../utils'

const { icons, options, columns, localization } = config

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tableTitleRoot: {
      display: 'flex',
      alignItems: 'center',
    },
    titleIcon: {
      fontSize: '0.6em',
      color: theme.palette.grey[700],
      marginRight: theme.spacing(1),
    },
  })
)

// TODO: separate file
const Title: FC = () => {
  const classes = useStyles()

  return (
    <Typography variant="h4" className={classes.tableTitleRoot}>
      <TiThList className={classes.titleIcon} />
      Data
    </Typography>
  )
}

// TODO: rm when settled
// function MuiFriendlyIcon(props: SvgIconProps) {
//   return <SvgIcon component={GoFile} {...props} />
// }

export const ResultsTable: FC = () => {
  const { state } = useContext(GlobalContext)
  const history = useHistory()
  const loc = useLocation()
  const { height } = useWindowResize()

  // TODO: some kind of `useState` to set asc/desc and sort Neighborhoods
  // properly (blanks last, regardless of direction)

  // TODO: highlight selected feature in table
  return (
    <MaterialTable
      icons={icons}
      options={{
        ...options,
        maxBodyHeight: height - 118, // TODO: more exact for mobile and desk
      }}
      columns={columns}
      localization={localization}
      data={state.langFeatures}
      title={<Title />}
      onRowClick={(event, rowData) => {
        if (rowData) {
          history.push(`/details?id=${rowData.ID}`)
        }
      }}
      actions={[
        {
          icon: () => <IoMdHelpCircle />,
          tooltip: 'Glossary',
          isFreeAction: true,
          // eslint-disable-next-line no-alert
          onClick: () => alert('Glossary will open'),
          // onClick: () => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          // history.push(`/glossary${loc.search}`)
          // },
        },
        {
          icon: () => <IoMdCloseCircle />,
          tooltip: 'Exit to map',
          isFreeAction: true,
          onClick: () => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            history.push(`/${loc.search}`)
          },
        },
        {
          icon: () => <GoFile />,
          tooltip: 'Show description',
          onClick: () =>
            // eslint-disable-next-line no-alert
            alert(
              'Description popout will open and use similar style as before (e.g. serif font and initial letter much larger)'
            ),
        },
        {
          icon: () => <FiShare />,
          tooltip: 'Share this community',
          // onClick: (event: React.MouseEvent, rowData) => { // TODO: wire up
          // eslint-disable-next-line no-alert
          onClick: () => alert('Sharing popout will open'),
        },
      ]}
    />
  )
}

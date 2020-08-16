/* eslint-disable react/display-name */
import React, { FC, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import MaterialTable from 'material-table'
import { Typography } from '@material-ui/core'
import { FaMapMarkedAlt } from 'react-icons/fa'
import { GoFile } from 'react-icons/go'
import { MdShare } from 'react-icons/md'

import { GlobalContext, GlossaryTrigger } from 'components'
import * as config from './config'
import { RecordDescription } from './RecordDescription'

const { icons, options, columns, localization } = config

type ResultsTableComponent = {
  setResultsModalOpen: React.Dispatch<boolean>
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    resultsTableTitle: {
      display: 'flex',
      flexDirection: 'column',
    },
  })
)

const Title: FC = () => {
  const classes = useStyles()

  return (
    <div className={classes.resultsTableTitle}>
      <Typography variant="h3">
        Results Data
        <GlossaryTrigger />
      </Typography>
    </div>
  )
}

export const ResultsTable: FC<ResultsTableComponent> = ({
  setResultsModalOpen,
}) => {
  const { state } = useContext(GlobalContext)
  const history = useHistory()

  // TODO: highlight selected feature in table
  return (
    <MaterialTable
      icons={icons}
      options={options}
      columns={columns}
      localization={localization}
      data={state.langFeatures}
      title={<Title />}
      actions={[
        {
          icon: () => <FaMapMarkedAlt />,
          tooltip: 'View in map',
          onClick: (event: React.MouseEvent, rowData) => {
            setResultsModalOpen(false)

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            history.push(`/details?id=${rowData.ID}`)
          },
        },
        {
          icon: () => <MdShare />,
          tooltip: 'Share this community',
          onClick: () => null,
          // TODO: wire up
          // onClick: (event: React.MouseEvent, rowData) => {
          //   console.log(
          //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //     // @ts-ignore
          //     `This would open a sharing panel for record ${rowData.ID}`
          //   )
          // },
        },
      ]}
      detailPanel={[
        {
          icon: () => <GoFile />,
          tooltip: 'Show description',
          render: (rowData) => <RecordDescription text={rowData.Description} />,
        },
      ]}
    />
  )
}

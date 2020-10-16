import { CsvBuilder } from 'filefy'
import jsPDF from 'jspdf'
import autoTable, { RowInput, UserOptions } from 'jspdf-autotable'

import { ColumnList } from './types'
import { LangRecordSchema } from '../../context/types'

export const exportCsv = (
  columnList: ColumnList,
  initialData: LangRecordSchema[]
): void => {
  const columns = columnList.filter(
    (columnDef) => !columnDef.hidden && columnDef.export !== false
  )

  const data = initialData.map((rowData) =>
    columns.map((columnDef) => rowData[columnDef.field])
  )

  const builder = new CsvBuilder('nyc-language-data.csv')

  builder
    .setDelimeter(',')
    .setColumns(columns.map((columnDef) => columnDef.field))
    .addRows(data)
    .exportFile()
}

export const exportPdf = (
  columnList: ColumnList,
  initialData: LangRecordSchema[]
): void => {
  const GENTIUM_PATH = '/fonts/GentiumPlus-R-normal.json'

  const columns = columnList.filter((columnDef) => {
    return !columnDef.hidden && columnDef.field && columnDef.export !== false
  })

  const data = initialData.map((rowData) =>
    columns.map((columnDef) => rowData[columnDef.field])
  )

  const unit = 'pt'
  const format = 'letter'
  const orientation = 'landscape'

  async function showAvatar() {
    const response = await fetch(GENTIUM_PATH)
    const { font } = await response.json()

    // eslint-disable-next-line new-cap
    const doc = new jsPDF({ orientation, unit, format })

    doc.addFileToVFS('GentiumPlus-Regular.ttf', font)
    doc.addFont('GentiumPlus-Regular.ttf', 'GentiumPlus-Regular', 'normal')

    const content: UserOptions = {
      startY: 50,
      head: [columns.map((columnDef) => columnDef.field)],
      body: data as RowInput[],
      styles: {
        font: 'GentiumPlus-Regular',
      },
      theme: 'striped',
    }

    doc.setFont('GentiumPlus-Regular', 'normal')
    doc.setFontSize(15)
    doc.text('Languages of New York City', 40, 40)

    // Create table layout and save to filesystem
    autoTable(doc, content)
    doc.save('nyc-language-data.pdf')
  }

  showAvatar()
}

import { CsvBuilder } from 'filefy'
import jsPDF from 'jspdf'
import autoTable, { RowInput, UserOptions } from 'jspdf-autotable'
import * as config from './config'
import { ColumnList } from './types'
import { LangRecordSchema } from '../../context/types'

const getColumns = (columnList: ColumnList) =>
  columnList.filter(
    (columnDef) => !columnDef.hidden && columnDef.export !== false
  )

const getData = (columns: ColumnList, initialData: LangRecordSchema[]) =>
  initialData.map((rowData) =>
    columns.map((columnDef) => {
      const { field } = columnDef
      const value = rowData[field] as number | string

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore // couldn't figure this one out
      if (field === 'Size') return config.COMM_SIZE_COL_MAP[value]
      if (field === 'Global Speaker Total') return value.toLocaleString()

      return value
    })
  )

export const exportCsv = (
  columnList: ColumnList,
  initialData: LangRecordSchema[]
): void => {
  const columns = getColumns(columnList)
  const data = getData(columns, initialData)
  const builder = new CsvBuilder(`${config.tableExportMeta.filename}.csv`)

  builder
    .setDelimeter(',')
    .setColumns(columns.map((columnDef) => columnDef.title))
    .addRows(data)
    .exportFile()
}

export const exportPdf = (
  columnList: ColumnList,
  initialData: LangRecordSchema[]
): void => {
  // NOTE: if additional fonts are to be added, use this converter to encode:
  // https://rawgit.com/MrRio/jsPDF/master/fontconverter/fontconverter.html
  // then massage it into the same JSON format as the other(s).
  const GENTIUM_PATH = '/fonts/GentiumPlus-R-normal.json'

  const columns = getColumns(columnList)
  const data = getData(columns, initialData)

  // Page settings
  const unit = 'pt'
  const format = 'letter'
  const orientation = 'landscape'

  async function createPDF() {
    // TODO: consider prefetch w/react-query in the component itself
    const response = await fetch(GENTIUM_PATH)
    const { font } = await response.json()
    const doc = new jsPDF({ orientation, unit, format })
    const titleY = 50

    doc.addFileToVFS('GentiumPlus-Regular.ttf', font)
    doc.addFont('GentiumPlus-Regular.ttf', 'GentiumPlus-Regular', 'normal')

    const content: UserOptions = {
      body: data as RowInput[],
      head: [
        columns.map((columnDef) => {
          const { title, field } = columnDef

          // Columns with React components inside them (e.g. "Local" indicator)
          // are objects, all others are strings
          if (typeof title === 'string') return title

          return field
        }),
      ],
      margin: { horizontal: 30 },
      rowPageBreak: 'avoid',
      startY: titleY + 15,
      styles: {
        font: 'GentiumPlus-Regular',
      },
      headStyles: {
        fillColor: '#409685',
        fontSize: 13,
        valign: 'middle',
      },
    }

    doc.setFont('GentiumPlus-Regular', 'normal')
    doc.setFontSize(24)

    const pageWidth =
      doc.internal.pageSize.width || doc.internal.pageSize.getWidth()

    doc.text(config.tableExportMeta.pageTitle, pageWidth / 2, titleY, {
      align: 'center',
    })

    // Create table layout and save to filesystem
    autoTable(doc, content)
    doc.save(`${config.tableExportMeta.filename}.pdf`)
  }

  createPDF()
}

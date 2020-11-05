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
    .setColumns(
      columns.map((columnDef) => {
        const { title, field } = columnDef

        // Columns with React components inside them (e.g. "Local" indicator)
        // are objects, all others are strings.
        return typeof title === 'string' ? title : field
      })
    )
    .addRows(data)
    .exportFile()
}

// TODO: if switching UI headings to Gentium Alt, use that instead of Plus here
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
    const titleY = 50
    const titleFontSize = 24
    const totalPagesExp = '{total_pages_count_string}'
    const doc = new jsPDF({ orientation, unit, format })
    const pageWidth = doc.internal.pageSize.getWidth()

    const content: UserOptions = {
      body: data as RowInput[],
      // Use `columns` instead of `head` to get more control over the columns,
      // and more importantly to be able to define the keys used by
      // `columnStyles` rather than relying on the default (index).
      columns: columns.map((columnDef) => {
        const { title, field } = columnDef

        return {
          dataKey: field,
          // Columns with React components inside them (e.g. "Local" indicator)
          // are objects, all others are strings.
          // TODO: ^^^ create method to reuse this same logic for CSV columns
          header: typeof title === 'string' ? title : field,
        }
      }),
      margin: { horizontal: titleFontSize },
      rowPageBreak: 'avoid',
      startY: titleY + titleFontSize,
      theme: 'striped', // should be default already
      // Document-wide styles
      styles: {
        font: 'GentiumPlus-Regular',
      },
      columnStyles: {
        'World Region': { cellWidth: 65 }, // "Southeastern" won't wrap
        Neighborhood: { cellWidth: 100 }, // fits column heading
        Size: { cellWidth: 50 },
        Status: { cellWidth: 75 }, // "Community" fits
        'Global Speaker Total': { halign: 'right' },
      },
      headStyles: {
        fillColor: '#409685',
        fontSize: 11,
        valign: 'middle',
      },
      // Runs on each page, e.g. to show page numbers in footer
      didDrawPage(currentPageData) {
        const str = `Page ${currentPageData.pageNumber} of ${totalPagesExp}`
        const { pageSize } = doc.internal
        const pageHeight = pageSize.getHeight()

        doc.setFontSize(10)
        doc.setTextColor('#333') // otherwise still link color
        doc.text(str, pageWidth / 2 - 20, pageHeight - titleFontSize)
      },
    }

    // Custom font/s
    doc.addFileToVFS('GentiumPlus-Regular.ttf', font)
    doc.addFont('GentiumPlus-Regular.ttf', 'GentiumPlus-Regular', 'normal')
    doc.setFont('GentiumPlus-Regular', 'normal')

    // Page title
    doc.setFontSize(titleFontSize)
    doc.text(config.tableExportMeta.pageTitle, pageWidth / 2, titleY, {
      align: 'center',
    })

    // Link to full dataset
    doc.setFontSize(10)
    doc.setTextColor('#2196f3')
    doc.textWithLink(
      'View full source dataset in spreadsheet format',
      pageWidth / 2 - 95, // so fragile
      titleY + 15,
      {
        url: config.tableExportMeta.fullDatasetURL,
      }
    )

    // Create table layout automatically-ish via plugin
    autoTable(doc, content)

    // Footer: replace the expression used the per-page loop of jspdf-autotable
    // NOTE: total page number plugin only available in jspdf v1.0+
    doc.putTotalPages(totalPagesExp)

    // Open PDF in new tab, albeit with random hash suffix and "blob" prefix,
    // but this was better than opening in current tab.
    const blob = doc.output('blob')
    window.open(URL.createObjectURL(blob))

    // Great thread on why it's not possible to have your 🍰 and eat it too:
    // https://stackoverflow.com/questions/41947735/custom-name-for-blob-url
  }

  createPDF()
}

import { CsvBuilder } from 'filefy'
import jsPDF from 'jspdf'
import autoTable, { RowInput, UserOptions } from 'jspdf-autotable'
import { LangRecordSchema } from 'components/context/types'
import * as config from './config'
import { ColumnList } from './types'

// CRED: https://stackoverflow.com/a/9039885/1048518
function iOS(): boolean {
  return (
    [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod',
    ].includes(navigator.platform) ||
    // iPad on iOS 13 detection
    (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
  )
}

const getColumns = (columnList: ColumnList) =>
  columnList.filter(
    (columnDef) => !columnDef.hidden && columnDef.export !== false
  )

const getData = (columns: ColumnList, initialData: LangRecordSchema[]) =>
  initialData.map((rowData) =>
    columns.map(({ field }) => {
      const value = rowData[field] as number | string

      if (field === 'Global Speaker Total')
        return value ? value.toLocaleString() : ''
      if (field === 'Endonym') return excludeUTFtext(value as string)

      return Array.isArray(value) ? value.join(',\n') : value
    })
  )

// Columns with React components inside them (e.g. "Local" indicator) are
// objects, all others are strings. "Primary Location" needs manual adjustment.
const getColumnTitle = (
  title: string | React.ReactElement,
  field: string
): string => {
  if (field === 'Primary Location') return 'Location'
  if (typeof title === 'string') return title

  return field
}

export const exportCsv = (
  columnList: ColumnList,
  initialData: LangRecordSchema[]
): void => {
  const columns = getColumns(columnList)
  const data = getData(columns, initialData)
  const builder = new CsvBuilder(`${config.tableExportMeta.filename}.csv`)

  builder
    .setDelimeter(',')
    .setColumns(columns.map(({ title, field }) => getColumnTitle(title, field)))
    .addRows(data)
    .exportFile()
}

// CRED: https://stackoverflow.com/a/19828943/1048518
// CRED: https://stackoverflow.com/a/36449773/1048518
const excludeUTFtext = (input: string): string => {
  // eslint-disable-next-line no-control-regex
  const nonRomanExp = /[^\u0000-\u024F\u1E00-\u1EFF\u2C60-\u2C7F\uA720-\uA7FF]/g
  const numMatchingChars = input.match(nonRomanExp)?.length

  return !numMatchingChars || numMatchingChars === input.length ? input : ''
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
      columns: columns.map(({ title, field }) => ({
        dataKey: field,
        header: getColumnTitle(title, field),
      })),
      margin: { horizontal: titleFontSize },
      rowPageBreak: 'avoid',
      startY: titleY + titleFontSize,
      theme: 'striped', // should be default already
      styles: { font: 'GentiumPlus-Regular' }, // document-wide styles
      columnStyles: {
        'World Region': { cellWidth: 75 }, // column title won't wrap
        Size: { cellWidth: 50 },
        Status: { cellWidth: 75 }, // "Community" fits
        Country: { cellWidth: 100 }, // "Central African Republic" fits
        Language: { cellWidth: 100 }, // lots of wrapping values
        'Global Speaker Total': { halign: 'right', cellWidth: 65 }, // China!
      },
      headStyles: {
        fillColor: '#409685',
        fontSize: 11,
        valign: 'middle',
        halign: 'left',
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
      'View full source dataset (includes non-Roman characters)',
      pageWidth / 2 - 120, // so fragile
      titleY + 15,
      {
        url: config.tableExportMeta.fullDatasetURL,
      }
    )

    autoTable(doc, content) // create table layout automatically-ish via plugin

    // Footer: replace the expression used the per-page loop of jspdf-autotable
    // NOTE: total page number plugin only available in jspdf v1.0+
    doc.putTotalPages(totalPagesExp)
    doc.setProperties({ title: 'Languages of NYC' })

    if (iOS()) doc.save('nyc-languages.pdf')
    else {
      // Open PDF in new tab, albeit with random hash suffix and "blob" prefix,
      // but this was better than opening in current tab. Used to work on iOS
      // Safari, but no longer 🤔
      const blob = doc.output('blob')
      window.open(URL.createObjectURL(blob))
    }

    // Great thread on why it's not possible to have your 🍰 and eat it too:
    // https://stackoverflow.com/questions/41947735/custom-name-for-blob-url
  }

  createPDF()
}

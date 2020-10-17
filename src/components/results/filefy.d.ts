// Need this file since no TS defs
declare module 'filefy' {
  export class CsvBuilder {
    setDelimeter(setDelimeter: string): CsvBuilder
    setColumns(columns: string[]): CsvBuilder
    addRows(rows: unknown): CsvBuilder
    exportFile(): void
    constructor(filename: string)
  }
}

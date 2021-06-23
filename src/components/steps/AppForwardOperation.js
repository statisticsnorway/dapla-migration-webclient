import { AnyImport, CsvImport } from '../files/operations'

function AppForwardOperation ({ operation, file }) {
  switch (operation.operation) {
    case 'any-import':
      return <AnyImport file={file} />

    case 'csv-import':
      return <CsvImport file={file} />

    default:
      return (
        <>

        </>
      )
  }
}

export default AppForwardOperation

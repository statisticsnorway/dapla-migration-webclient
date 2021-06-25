import { AnyImport, CsvImport } from '../files/operations'
import { API } from '../../configurations'

function AppForwardOperation ({ operation, file }) {
  switch (operation.operation) {
    case API.OPERATIONS[0]:
      return <AnyImport file={file} />

    case API.OPERATIONS[1]:
      return <CsvImport file={file} />

    default:
      return (
        <>

        </>
      )
  }
}

export default AppForwardOperation

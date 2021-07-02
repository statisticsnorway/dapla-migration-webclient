import { AnyImport, HeadOfFile } from '../files/operations'
import { API } from '../../configurations'

function AppForwardOperation ({ operation, file, trigger }) {
  switch (operation.operation) {
    case API.OPERATIONS[0]:
      return <AnyImport file={file} trigger={trigger} />

    case API.OPERATIONS[1]:
      return <HeadOfFile file={file} operation={operation.operation} />

    default:
      return (
        <>

        </>
      )
  }
}

export default AppForwardOperation

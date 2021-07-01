import { API } from '../../configurations'

import CopyFileStatus from '../files/copy/CopyFileStatus'
import AnyImportStatus from '../files/operations/any-import/AnyImportStatus'
import CsvImportStatus from '../files/operations/csv-import/CsvImportStatus'

function MigrationStatusForward ({ statusId, info, isCompleted, data }) {
  switch (info.command) {
    case 'copy':
      return <CopyFileStatus
        file={info.file}
        fileSize={info.fileSize}
        transactionId={statusId}
        isCompleted={isCompleted}
        nextCommand={info.nextCommand}
      />

    case API.OPERATIONS[0]:
      return <AnyImportStatus
        file={
          {
            folder: info.file[0].substr(0, info.file[0].lastIndexOf('/')),
            filename: info.file[0].substr(info.file[0].lastIndexOf('/') + 1, info.file[0].length)
          }
        }
        isCompleteData={data}
        transactionId={statusId}
        isCompleted={isCompleted}
      />

    case API.OPERATIONS[1]:
      return <CsvImportStatus
        file={
          {
            folder: info.file[0].substr(0, info.file[0].lastIndexOf('/')),
            filename: info.file[0].substr(info.file[0].lastIndexOf('/') + 1, info.file[0].length)
          }
        }
        isCompleteData={data}
        transactionId={statusId}
        isCompleted={isCompleted}
        convertAfterImport={info.convertAfterImport}
      />

    default:
      return (
        <>

        </>
      )
  }
}

export default MigrationStatusForward

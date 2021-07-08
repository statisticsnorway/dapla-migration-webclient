import { API } from '../../configurations'

import CopyFileStatus from '../files/copy/CopyFileStatus'
import AnyImportStatus from '../files/operations/any-import/AnyImportStatus'
import CsvImportStatus from '../files/operations/csv-import/CsvImportStatus'
import ArchiveUnpackStatus from '../files/operations/archive-import/ArchiveUnpackStatus'
import ArchiveImportStatus from '../files/operations/archive-import/ArchiveImportStatus'

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

    case API.ARCHIVE_UNPACK:
      return <ArchiveUnpackStatus
        file={info.file}
        isCompleteData={data}
        transactionId={statusId}
        isCompleted={isCompleted}
      />

    case API.OPERATIONS[3]:
      return <ArchiveImportStatus
        file={
          {
            folder: info.file.substr(0, info.file.lastIndexOf('/')),
            filename: info.file.substr(info.file.lastIndexOf('/') + 1, info.file.length)
          }
        }
        isCompleteData={data}
        transactionId={statusId}
        isCompleted={isCompleted}
      />

    default:
      return (
        <>

        </>
      )
  }
}

export default MigrationStatusForward

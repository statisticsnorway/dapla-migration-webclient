import { useLocation, useParams } from 'react-router-dom'
import { Divider, Header } from 'semantic-ui-react'

import { HeadOfFile } from '../files/operations'
import AppForwardOperation from './AppForwardOperation'

function AppDoOperation () {
  let operation = useParams()
  let location = useLocation()

  return (
    <>
      <Header
        size="large"
        icon="file code"
        subheader={location.state.file.folder}
        content={location.state.file.filename}
      />
      {operation.operation === 'any-import' &&
      <>
        <HeadOfFile file={location.state.file} />
        <Divider hidden />
      </>
      }
      <AppForwardOperation operation={operation} file={location.state.file} />
    </>
  )
}

export default AppDoOperation

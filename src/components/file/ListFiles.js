import { useEffect, useState } from 'react'
import useAxios from 'axios-hooks'
import { Header, Icon, List, Segment } from 'semantic-ui-react'

import CopyFile from './CopyFile'
import { API } from '../../configurations'

function ListFiles ({ apiUrl }) {
  const [url] = useState(`${window.__ENV.REACT_APP_API}${API[`GET_${apiUrl}`]}`)

  const [{ data, loading, error }, refetch] = useAxios(url, { manual: true, useCache: false })

  useEffect(() => {
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Header size="large">
        {`${apiUrl} filer `}
        <Icon link name="sync alternate" loading={loading} onClick={() => refetch()} />
      </Header>
      <Segment basic loading={loading}>
        {data && !loading && !error &&
        <List>
          {data.files.map(file =>
            <List.Item key={file.filename}>
              {JSON.stringify(file, null, 2)}
              {apiUrl === 'SAS' && <CopyFile file={file} />}
            </List.Item>
          )}
        </List>
        }
      </Segment>
    </>
  )
}

export default ListFiles

import useAxios from 'axios-hooks'
import { useEffect, useState } from 'react'
import { Divider, Icon } from 'semantic-ui-react'

import FileInspect from './FileInspect'

function FileInspectStatus ({ id }) {
  const [ready, setReady] = useState(false)

  const [{
    data,
    loading,
    error
  }, refetch] = useAxios(
    `${window.__ENV.REACT_APP_API}/cmd/id/${id}`,
    { manual: true, useCache: false }
  )

  useEffect(() => {
    const interval = setInterval(() => {
      checkStatus().then()
    }, 2000)

    const checkStatus = async () => {
      await refetch().then(res => {
        if (res.data.state.status === 'completed') {
          setReady(true)
          clearInterval(interval)
        }
      })
    }

    return () => clearInterval(interval)
    // eslint-disable-next-line
  }, [])

  return (
    <>
      {!ready && !error && <Icon color="blue" name="sync alternate" loading />}
      {ready && !loading && !error && <Icon color="green" name="check" />}
      <Divider hidden />
      {ready && !loading && !error && <FileInspect data={data} />}
    </>
  )
}

export default FileInspectStatus

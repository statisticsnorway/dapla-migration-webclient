import useAxios from 'axios-hooks'
import { useEffect, useState } from 'react'
import { Divider, Icon, Progress } from 'semantic-ui-react'

function FileImportStatus ({ transactionId }) {
  const [ready, setReady] = useState(false)

  const [{
    data,
    loading,
    error
  }, refetch] = useAxios(
    `${window.__ENV.REACT_APP_API}/cmd/id/${transactionId}`,
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
      <Progress percent={ready ? 100 : 0} progress warning={!ready} success={ready} />
      {ready && !loading && !error &&
      <>
        {`Start time: ${data.state.startTime}`}
        <br />
        {`Completed: ${data.state.timestamp}`}
        <br />
        {`Status: ${data.state.status} `}
        <Icon color="green" name="check" />
        <Divider hidden />
        {JSON.stringify(data.result.status, null, 2)}
      </>
      }
    </>
  )
}

export default FileImportStatus

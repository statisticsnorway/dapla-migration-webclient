import useAxios from 'axios-hooks'
import AceEditor from 'react-ace'
import { useEffect, useState } from 'react'
import { Icon } from 'semantic-ui-react'

import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/theme-github'

function FileContentStatus ({ file }) {
  const [ready, setReady] = useState(false)
  const [stringValue, setStringValue] = useState('')

  const [{
    data,
    loading,
    error
  }, refetch] = useAxios(
    `${window.__ENV.REACT_APP_API}/agent/head?file=${file}`,
    { manual: true, useCache: false }
  )

  useEffect(() => {
    const interval = setInterval(() => {
      checkStatus().then()
    }, 2000)

    const checkStatus = async () => {
      await refetch().then(res => {
        if (res.status === 200) {
          setReady(true)
          clearInterval(interval)
        }
      })
    }

    return () => clearInterval(interval)
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (data !== undefined) {
      const string = data.data.map(line => atob(line)).join('\n')

      setStringValue(string)
    }
  }, [data])

  return (
    <>
      {!ready && !error && <Icon color="blue" name="sync alternate" loading />}
      {ready && !loading && !error &&
      <AceEditor
        fontSize={16}
        height="250px"
        theme="github"
        readOnly={true}
        mode="javascript"
        value={stringValue}
        name="UNIQUE_ID_OF_DIV"
        editorProps={{ $blockScrolling: true }}
      />
      }
    </>
  )
}

export default FileContentStatus

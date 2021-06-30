import useAxios from 'axios-hooks'
import { useContext, useEffect, useState } from 'react'
import { Icon } from 'semantic-ui-react'
import { ErrorMessage } from '@statisticsnorway/dapla-js-utilities'

import AppMagicScan from './AppMagicScan'
import AppMagicPreCopy from './AppMagicPreCopy'
import { LanguageContext } from '../../context/AppContext'
import { API } from '../../configurations'

function AppMagicInit ({ fullPath, command }) {
  const { language } = useContext(LanguageContext)

  const [ready, setReady] = useState(false)
  const [fileSize, setFileSize] = useState(0)
  const [haveToScanForFile, setHaveToScanForFile] = useState(true)

  const [{ data, loading, error }, executeGet] = useAxios({ method: 'GET' }, { manual: true, useCache: false })

  useEffect(() => {
    const path = fullPath.substr(0, fullPath.lastIndexOf('/'))

    executeGet({ url: `${window.__ENV.REACT_APP_API}/${API.AGENTS.SAS_AGENT}${API.FOLDER}${path}` })
  }, [executeGet, fullPath])

  useEffect(() => {
    if (!loading && !error && data !== undefined) {
      const file = fullPath.substr(fullPath.lastIndexOf('/') + 1, fullPath.length)

      if (data.files.length > 0) {
        const findFile = data.files.filter(element => element.filename === file)

        if (findFile.length === 1) {
          setFileSize(findFile[0].size)
          setHaveToScanForFile(false)
        } else {
          setHaveToScanForFile(true)
        }
      } else {
        setHaveToScanForFile(true)
      }

      setReady(true)
    }
  }, [loading, error, data, fullPath])

  return (
    <>
      {!loading && error && <ErrorMessage error={error} language={language} />}
      {loading && !error && <Icon size="large" color="blue" name="sync alternate" loading />}
      {!loading && ready && haveToScanForFile && <AppMagicScan fullPath={fullPath} command={command} />}
      {!loading && ready && !haveToScanForFile &&
      <AppMagicPreCopy fullPath={fullPath} fileSize={fileSize} command={command} />
      }
    </>
  )
}

export default AppMagicInit

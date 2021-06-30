import useAxios from 'axios-hooks'
import { Redirect } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { Icon } from 'semantic-ui-react'
import { ErrorMessage } from '@statisticsnorway/dapla-js-utilities'

import AppMagicCopy from './AppMagicCopy'
import { LanguageContext } from '../../context/AppContext'
import { API, APP } from '../../configurations'

function AppMagicPreCopy ({ fullPath, fileSize, command }) {
  const { language } = useContext(LanguageContext)

  const [ready, setReady] = useState(false)
  const [haveToCopyFile, setHaveToCopyFile] = useState(true)

  const [{ data, loading, error }, executeGet] = useAxios({ method: 'GET' }, { manual: true, useCache: false })

  useEffect(() => {
    const path = fullPath.substr(0, fullPath.lastIndexOf('/'))

    executeGet({ url: `${window.__ENV.REACT_APP_API}/${API.AGENTS.AGENT}${API.FOLDER}${path}` })
  }, [executeGet, fullPath])

  useEffect(() => {
    if (!loading && !error && data !== undefined) {
      const file = fullPath.substr(fullPath.lastIndexOf('/') + 1, fullPath.length)

      if (data.files.length > 0) {
        const findFile = data.files.filter(element => element.filename === file)

        if (findFile.length === 1) {
          setHaveToCopyFile(false)
        } else {
          setHaveToCopyFile(true)
        }
      } else {
        setHaveToCopyFile(true)
      }

      setReady(true)
    }
  }, [loading, error, data, fullPath])

  return (
    <>
      {!loading && error && <ErrorMessage error={error} language={language} />}
      {loading && !error && <Icon size="large" color="blue" name="sync alternate" loading />}
      {!loading && ready && !haveToCopyFile &&
      <Redirect
        to={{
          pathname: `${APP[2].route}/${command}`,
          state: {
            file: {
              folder: fullPath.substr(0, fullPath.lastIndexOf('/')),
              filename: fullPath.substr(fullPath.lastIndexOf('/') + 1, fullPath.length)
            }
          }
        }}
      />
      }
      {!loading && ready && haveToCopyFile &&
      <AppMagicCopy fullPath={fullPath} fileSize={fileSize} command={command} />
      }
    </>
  )
}

export default AppMagicPreCopy

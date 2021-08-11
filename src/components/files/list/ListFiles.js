import useAxios from 'axios-hooks'
import { useContext, useEffect, useState } from 'react'
import { Divider, Grid, Icon, Input, Segment } from 'semantic-ui-react'
import { ErrorMessage, InfoPopup } from '@statisticsnorway/dapla-js-utilities'

import SelectFile from './SelectFile'
import { LanguageContext } from '../../../context/AppContext'
import { API } from '../../../configurations'
import { APP_STEPS, TEST_IDS } from '../../../enums'

function ListFiles ({ agent, scanPath, initWithFile }) {
  const { language } = useContext(LanguageContext)

  const [path, setPath] = useState('')
  const [ready, setReady] = useState(false)

  const [{ data, loading, error }, executeGet] = useAxios({ method: 'GET' }, { manual: true, useCache: false })

  useEffect(() => {
    if (initWithFile) {
      const pathArray = initWithFile.split('/')
      pathArray.splice(pathArray.length - 1, 1)
      const pathString = pathArray.join('/')

      setPath(pathString)
      executeGet({ url: `${window.__ENV.REACT_APP_API}/${agent}${API.FOLDER}${pathString}` })
      setReady(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Grid columns="equal">
        <Grid.Column>
          <Input
            fluid
            size="large"
            value={path}
            disabled={loading}
            placeholder={APP_STEPS.SCAN.PLACEHOLDER[language]}
            onChange={(e, { value }) => {
              setReady(false)
              setPath(value)
            }}
            onKeyPress={({ key }) => {
              if (key === 'Enter') {
                executeGet({ url: `${window.__ENV.REACT_APP_API}/${agent}${API.FOLDER}${path}` })
                setReady(true)
              }
            }}
          />
        </Grid.Column>
        <Grid.Column verticalAlign="middle">
          {agent === API.AGENTS.SAS_AGENT && !ready && scanPath !== '' &&
          <InfoPopup
            text={APP_STEPS.LIST.PASTE_PATH[language]}
            trigger={
              <Icon
                link
                size="large"
                color="blue"
                name="paste"
                data-testid={TEST_IDS.PASTE_PATH_TRIGGER}
                onClick={() => {
                  setPath(scanPath)
                  executeGet({ url: `${window.__ENV.REACT_APP_API}/${agent}${API.FOLDER}${scanPath}` })
                  setReady(true)
                }}
              />
            }
          />
          }
          {!loading && error && <ErrorMessage error={error} language={language} />}
          {loading && !error && <Icon size="large" color="blue" name="sync alternate" loading />}
        </Grid.Column>
      </Grid>
      <Divider />
      {!loading && !error && ready && data !== undefined &&
      <Segment basic>
        <SelectFile agent={agent} files={data.files} initWithFile={initWithFile} />
      </Segment>
      }
    </>
  )
}

export default ListFiles

import useAxios from 'axios-hooks'
import { useContext, useEffect, useState } from 'react'
import { Grid, Icon, Input, Segment } from 'semantic-ui-react'
import { ErrorMessage, getNestedObject, InfoPopup } from '@statisticsnorway/dapla-js-utilities'

import { LanguageContext } from '../../context/AppContext'
import { API, LOCAL_STORAGE } from '../../configurations'
import { APP_STEPS, TEST_IDS } from '../../enums'

function CheckStatus () {
  const { language } = useContext(LanguageContext)

  const [ready, setReady] = useState(false)
  const [statusId, setStatusId] = useState('')
  const [alreadyInMyStatuses, setAlreadyInMyStatuses] = useState(false)

  const [{ data, loading, error }, executeGet] = useAxios({ method: 'GET' }, { manual: true, useCache: false })

  useEffect(() => {
    if (ready) {
      if (localStorage.getItem(statusId) !== null) {
        setAlreadyInMyStatuses(true)
      } else {
        setAlreadyInMyStatuses(false)
      }
    }
  }, [statusId, ready])

  const handleAddToMyStatuses = async () => {
    const command = getNestedObject(data, ['command', 'cmd'])
    const info = { command: command }
    let addToMyStatuses = true

    if (command !== undefined) {
      switch (command) {
        case API.OPERATIONS[0]:
          info.file = getNestedObject(data, ['command', 'args', 'template', 'files'])
          break

        case API.OPERATIONS[1]:
          info.file = getNestedObject(data, ['command', 'args', 'template', 'files'])
          info.convertAfterImport = getNestedObject(data, ['command', 'convertAfterImport'])
          break

        case 'copy':
          const path = getNestedObject(data, ['command', 'args', 'path'])
          const actualPath = path.substr(0, path.lastIndexOf('/'))
          const file = path.substr(path.lastIndexOf('/') + 1, path.length)

          info.file = path

          await executeGet(
            { url: `${window.__ENV.REACT_APP_API}/${API.AGENTS.SAS_AGENT}${API.FOLDER}${actualPath}` }
          ).then(res => {
            if (res.data.files.length > 0) {
              const findFile = res.data.files.filter(element => element.filename === file)
              info.fileSize = findFile[0].size
            }
          })
          break

        default:
          addToMyStatuses = false
          break
      }
    }

    if (addToMyStatuses) {
      LOCAL_STORAGE(statusId, info)
      setAlreadyInMyStatuses(true)
      setStatusId('')
      setReady(false)
    } else {
      console.log(`${statusId} cannot be added to your statuses because the command '${command}' is not trackable`)
    }
  }

  return (
    <Segment basic>
      <Grid columns="equal">
        <Grid.Column>
          <Input
            fluid
            size="large"
            value={statusId}
            disabled={loading}
            placeholder={APP_STEPS.STATUS.PLACEHOLDER[language]}
            onChange={(e, { value }) => {
              setReady(false)
              setStatusId(value)
            }}
            onKeyPress={({ key }) => {
              if (key === 'Enter') {
                executeGet({ url: `${window.__ENV.REACT_APP_API}${API.COMMAND}${statusId}` })
                setReady(true)
              }
            }}
          />
        </Grid.Column>
        <Grid.Column verticalAlign="middle">
          {!loading && error && <ErrorMessage error={error} language={language} />}
          {loading && !error && <Icon size="large" color="blue" name="sync alternate" loading />}
          {!loading && !error && ready && data !== undefined &&
          <>
            <InfoPopup
              text="Refresh"
              trigger={
                <Icon
                  link
                  bordered
                  size="large"
                  color="blue"
                  name="sync alternate"
                  onClick={() => executeGet({ url: `${window.__ENV.REACT_APP_API}${API.COMMAND}${statusId}` })}
                />
              }
            />
            {ready && !alreadyInMyStatuses &&
            <InfoPopup
              text={APP_STEPS.STATUS.ADD_STATUS[language]}
              trigger={
                <Icon
                  link
                  bordered
                  size="large"
                  color={loading ? 'blue' : 'green'}
                  name={loading ? 'spinner' : 'plus'}
                  onClick={() => handleAddToMyStatuses()}
                  data-testid={TEST_IDS.ADD_TO_MY_STATUSES}
                />
              }
            />
            }
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </>
          }
        </Grid.Column>
      </Grid>
    </Segment>
  )
}

export default CheckStatus

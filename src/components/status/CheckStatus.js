import useAxios from 'axios-hooks'
import { useContext, useEffect, useState } from 'react'
import { Grid, Icon, Input } from 'semantic-ui-react'
import { ErrorMessage, getNestedObject, InfoPopup } from '@statisticsnorway/dapla-js-utilities'

import { LanguageContext } from '../../context/AppContext'
import { API, LOCAL_STORAGE } from '../../configurations'
import { APP_STEPS } from '../../enums'

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

  const handleAddToMyStatuses = () => {
    const command = getNestedObject(data, ['command', 'cmd'])
    const info = {
      command: command
    }

    if (command !== undefined) {
      switch (command) {
        case API.OPERATIONS[0]:
        case API.OPERATIONS[1]:
          info.file = getNestedObject(data, ['command', 'args', 'template', 'files'])
          break

        case 'copy':
          info.file = getNestedObject(data, ['command', 'args', 'path'])
          break

        default:
          info.file = ''
          break
      }
    }

    LOCAL_STORAGE(statusId, info)
    setAlreadyInMyStatuses(true)
  }

  return (
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
                name="plus"
                size="large"
                color="green"
                onClick={() => handleAddToMyStatuses()}
              />
            }
          />
          }
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </>
        }
      </Grid.Column>
    </Grid>
  )
}

export default CheckStatus

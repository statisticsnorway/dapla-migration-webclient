import useAxios from 'axios-hooks'
import { useContext, useEffect, useState } from 'react'
import { Accordion, Confirm, Icon, Label, Segment } from 'semantic-ui-react'
import { ErrorMessage } from '@statisticsnorway/dapla-js-utilities'

import MigrationStatusForward from './MigrationStatusForward'
import { LanguageContext } from '../../context/AppContext'
import { API } from '../../configurations'
import { APP_STEPS } from '../../enums'

function MigrationStatus ({ statusId, check, setCheck }) {
  const { language } = useContext(LanguageContext)

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [accordionOpen, setAccordionOpen] = useState(false)
  const [status, setStatus] = useState(API.STATUS.IN_PROGRESS)
  const [info] = useState(JSON.parse(localStorage.getItem(statusId)))

  const file = typeof info.file === 'string' ?
    info.file : Array.isArray(info.file) ?
      info.file[0] : `${info.file.folder}/${info.file.filename}`

  const [{
    data,
    loading,
    error
  }] = useAxios(`${window.__ENV.REACT_APP_API}${API.COMMAND}${statusId}`, { useCache: false })

  useEffect(() => {
    if (!loading && !error && data !== undefined) {
      switch (data.state.status) {
        case API.STATUS.IN_PROGRESS:
          setStatus(API.STATUS.IN_PROGRESS)
          break

        case API.STATUS.ERROR:
          setStatus(API.STATUS.ERROR)
          break

        case API.STATUS.COMPLETED:
          setStatus(API.STATUS.COMPLETED)
          break

        default:
          setStatus(API.STATUS.IN_PROGRESS)
      }
    }
  }, [data, loading, error])

  const handleRemoveFromLocalStorage = () => {
    const statuses = localStorage.getItem('statuses').split(',')
    const newStatuses = statuses.filter(element => element !== statusId)

    if (newStatuses.length === 0) {
      localStorage.removeItem('statuses')
    } else {
      localStorage.setItem('statuses', newStatuses.join(','))
    }

    localStorage.removeItem(statusId)

    setCheck(!check)
  }

  return (
    <>
      <Accordion styled>
        <Accordion.Title
          active={accordionOpen}
          onClick={() => setAccordionOpen(!accordionOpen)}
          style={{ fontSize: '1.1rem', fontWeight: 'bold' }}
        >
          <Icon name="dropdown" />
          {`${file} - ${info.command} `}
          {loading && <Icon color="blue" name="sync alternate" loading />}
          {!loading && error && <Icon color="red" name="warning circle" />}
          {!loading && !error &&
          <Icon
            loading={status === API.STATUS.IN_PROGRESS}
            color={status === API.STATUS.ERROR ? 'red' : status === API.STATUS.COMPLETED ? 'green' : 'blue'}
            name={status === API.STATUS.ERROR ? 'warning circle' : status === API.STATUS.COMPLETED ? 'check' : 'spinner'}
          />
          }
        </Accordion.Title>
        <Accordion.Content active={accordionOpen}>
          <Segment basic>
            <Label size="large" as="a" attached="bottom right" onClick={() => setConfirmOpen(true)}>
              <Icon fitted name="trash alternate outline" color="red" />
            </Label>
            {!loading && error && <ErrorMessage error={error} language={language} />}
            {!loading && !error && accordionOpen &&
            <MigrationStatusForward
              info={info}
              data={data}
              statusId={statusId}
              isCompleted={status === API.STATUS.COMPLETED}
            />
            }
          </Segment>
        </Accordion.Content>
      </Accordion>
      <Confirm
        content={`${file} - ${info.command} `}
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        header={APP_STEPS.STATUS.CLEAR_STORAGE.SINGLE_TEXT[language]}
        confirmButton={APP_STEPS.STATUS.CLEAR_STORAGE.CONFIRM[language]}
        cancelButton={{
          content: APP_STEPS.STATUS.CLEAR_STORAGE.CANCEL[language],
          color: 'red'
        }}
        onConfirm={() => {
          handleRemoveFromLocalStorage()
          setConfirmOpen(false)
        }}
      />
    </>
  )
}

export default MigrationStatus

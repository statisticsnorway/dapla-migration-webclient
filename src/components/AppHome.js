import useAxios from 'axios-hooks'
import { useContext, useState } from 'react'
import { Checkbox, Divider, Dropdown, Icon, Segment } from 'semantic-ui-react'
import { ErrorMessage } from '@statisticsnorway/dapla-js-utilities'

import ListFiles from './file/ListFiles'
import { LanguageContext } from '../context/AppContext'
import { API } from '../configurations'

const agentOptions = [
  { key: 'SAS', text: 'SAS', value: 'SAS' }
]

function AppHome () {
  const { language } = useContext(LanguageContext)

  const [agent, setAgent] = useState('SAS')
  const [simpleView, setSimpleView] = useState(false)

  const [{
    data,
    loading,
    error
  }, refetch] = useAxios(
    `${window.__ENV.REACT_APP_API}${API[`GET_${agent}`]}`,
    { useCache: false }
  )

  return (
    <>
      <Dropdown
        selection
        value={agent}
        options={agentOptions}
        onChange={(e, { value }) => setAgent(value)}
      />
      <Icon
        link
        size="large"
        color="blue"
        loading={loading}
        name="sync alternate"
        onClick={() => refetch()}
        data-testid='test-refetch'
        style={{ marginLeft: '0.5rem' }}
      />
      <Divider hidden />
      <Checkbox label="Simple view" toggle checked={simpleView} onChange={() => setSimpleView(!simpleView)} />
      <Divider />
      <Segment basic loading={loading}>
        {error && <ErrorMessage error={error} language={language} />}
        {data !== undefined && !loading && !error && <ListFiles files={data.files} simpleView={simpleView} />}
      </Segment>
    </>
  )
}

export default AppHome

import useAxios from 'axios-hooks'
import { useContext, useState } from 'react'
import { Divider, Grid, Input, Segment } from 'semantic-ui-react'
import { ErrorMessage } from '@statisticsnorway/dapla-js-utilities'

import SelectFile from './SelectFile'
import { LanguageContext } from '../../../context/AppContext'

function ListFiles ({ agent }) {
  const { language } = useContext(LanguageContext)

  const [ready, setReady] = useState(false)
  const [path, setPath] = useState('/ssb')

  const [{
    data,
    loading,
    error
  }, refetch] = useAxios(
    `${window.__ENV.REACT_APP_API}/${agent}/files?folder=${path}`,
    { manual: true, useCache: false }
  )

  return (
    <>
      <Grid columns="equal">
        <Grid.Row>
          <Grid.Column>
            <Input
              fluid
              size="large"
              value={path}
              icon="search"
              disabled={loading}
              placeholder="/ssb"
              onChange={(e, { value }) => {
                setPath(value)
                setReady(false)
              }}
              onKeyPress={({ key }) => {
                if (key === 'Enter') {
                  refetch()
                  setReady(true)
                }
              }}
            />
          </Grid.Column>
          <Grid.Column />
        </Grid.Row>
      </Grid>
      <Divider />
      <Segment basic loading={loading}>
        {error && <ErrorMessage error={error} language={language} />}
        {data !== undefined && !loading && !error && ready && <SelectFile agent={agent} files={data.files} />}
      </Segment>
    </>
  )
}

export default ListFiles

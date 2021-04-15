import useAxios from 'axios-hooks'
import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { Checkbox, Grid, Header, Icon, List, Segment } from 'semantic-ui-react'
import { ErrorMessage } from '@statisticsnorway/dapla-js-utilities'

import SetupFileImport from './SetupFileImport'
import { LanguageContext } from '../../context/AppContext'
import { API, APP_STEPS } from '../../configurations'

function ViewFiles () {
  const { language } = useContext(LanguageContext)

  const [fileToImport, setFileToImport] = useState('')

  const [{
    data,
    loading,
    error
  }, refetch] = useAxios(
    `${window.__ENV.REACT_APP_API}${API.GET_AGENT}`,
    { useCache: false }
  )

  const handleCheckbox = file => {
    if (fileToImport === file) {
      setFileToImport('')
    } else {
      setFileToImport(file)
    }
  }

  return (
    <Grid columns="equal">
      <Grid.Row>
        <Grid.Column>
          <Link to={APP_STEPS[0].route}>
            <Icon size="large" color="blue" name="arrow left" />
          </Link>
        </Grid.Column>
        <Grid.Column textAlign="right">
          <Icon
            link
            size="large"
            color="blue"
            loading={loading}
            name="sync alternate"
            onClick={() => refetch()}
            style={{ marginLeft: '0.5rem' }}
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <Segment basic loading={loading}>
            <Header content="Select file to inspect" />
            {error && <ErrorMessage error={error} language={language} />}
            <List>
              {data !== undefined && !loading && !error && data.files.map(file => {
                const fullFilename = `${file.folder}/${file.filename}`

                return <List.Item key={file.filename}>
                  {fullFilename}
                  {file.filename.split('.').pop() === 'csv' &&
                  <Checkbox
                    checked={fullFilename === fileToImport}
                    onClick={() => handleCheckbox(fullFilename)}
                    style={{ marginLeft: '0.5rem', paddingTop: '0.3rem' }}
                  />
                  }
                </List.Item>
              })}
            </List>
          </Segment>
        </Grid.Column>
        <Grid.Column>
          {fileToImport !== '' && <SetupFileImport file={fileToImport} />}
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}

export default ViewFiles

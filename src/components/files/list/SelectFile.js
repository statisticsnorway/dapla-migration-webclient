import { useContext, useEffect, useRef, useState } from 'react'
import { Checkbox, Divider, Grid, Header, Input, Item, List, Ref, Sticky } from 'semantic-ui-react'

import FilesList from './FilesList'
import FileDetailed from './FileDetailed'
import FilesListSimple from './FilesListSimple'
import SelectFileOperation from './SelectFileOperation'
import { LanguageContext } from '../../../context/AppContext'
import { API } from '../../../configurations'
import { APP_STEPS } from '../../../enums'

function SelectFile ({ agent, files, initWithFile }) {
  const { language } = useContext(LanguageContext)

  const [filteredFiles, setFilteredFiles] = useState(files)
  const [simpleView, setSimpleView] = useState(true)
  const [selectedFile, setSelectedFile] = useState('')
  const [filterFilesBy, setFilterFilesBy] = useState('')

  const appRefArea = useRef()

  const handleCheckbox = filename => setSelectedFile(filename)

  const handleFilterFiles = (e, { value }) => {
    setFilterFilesBy(value)

    if (value.length > 0) {
      if (value.startsWith('/')) {
        setFilteredFiles(files.filter(file => file.folder.toUpperCase().includes(value.toUpperCase())))
      } else {
        setFilteredFiles(files.filter(file => file.filename.toUpperCase().includes(value.toUpperCase())))
      }
    } else {
      setFilteredFiles(files)
    }
  }

  useEffect(() => {
    if (initWithFile) {
      setSelectedFile(initWithFile)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Ref innerRef={appRefArea}>
      <Grid columns="equal" divided>
        <Grid.Column>
          <Grid columns="equal">
            <Grid.Column>
              <Header size="large" content={APP_STEPS.LIST.HEADER[language]} />
            </Grid.Column>
            <Grid.Column textAlign="right">
              {agent === API.AGENTS.SAS_AGENT &&
              <Checkbox
                toggle
                checked={simpleView}
                onChange={() => setSimpleView(!simpleView)}
                label={APP_STEPS.LIST.SIMPLE_LIST[language]}
              />
              }
            </Grid.Column>
          </Grid>
          <Divider hidden />
          <Input
            fluid
            size="large"
            icon="filter"
            value={filterFilesBy}
            onChange={handleFilterFiles}
            placeholder={APP_STEPS.LIST.FILTER_LIST[language]}
          />
          <Divider hidden />
          {simpleView ?
            <List animated relaxed verticalAlign="middle">
              <FilesListSimple files={filteredFiles} selectedFile={selectedFile} handleCheckbox={handleCheckbox} />
            </List>
            :
            <Item.Group link>
              <FilesList files={filteredFiles} selectedFile={selectedFile} handleCheckbox={handleCheckbox} />
            </Item.Group>
          }
        </Grid.Column>
        <Grid.Column>
          {selectedFile !== '' &&
          <Sticky context={appRefArea} offset={80}>
            <Header size="large" content={APP_STEPS.LIST.SELECTED_FILE[language]} />
            {agent === API.AGENTS.SAS_AGENT &&
            <FileDetailed file={files.filter(file => `${file.folder}/${file.filename}` === selectedFile)[0]} />}
            {agent === API.AGENTS.AGENT &&
            <SelectFileOperation file={files.filter(file => `${file.folder}/${file.filename}` === selectedFile)[0]} />}
          </Sticky>
          }
        </Grid.Column>
      </Grid>
    </Ref>
  )
}

export default SelectFile

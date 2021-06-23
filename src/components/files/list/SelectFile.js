import { useRef, useState } from 'react'
import { Checkbox, Divider, Grid, Header, Input, Item, List, Ref, Sticky } from 'semantic-ui-react'

import FilesList from './FilesList'
import FileDetailed from './FileDetailed'
import FilesListSimple from './FilesListSimple'
import SelectFileOperation from './SelectFileOperation'

function SelectFile ({ agent, files }) {
  const [simpleView, setSimpleView] = useState(true)
  const [selectedFile, setSelectedFile] = useState('')
  const [filterFilesBy, setFilterFilesBy] = useState('')
  const [filteredFiles, setFilteredFiles] = useState(files)

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

  return (
    <Ref innerRef={appRefArea}>
      <Grid columns="equal" divided>
        <Grid.Column>
          <Grid columns="equal">
            <Grid.Column>
              <Header size="large" content="Select file" />
            </Grid.Column>
            <Grid.Column textAlign="right">
              {agent === 'sas' &&
              <Checkbox
                toggle
                label="Simple list"
                checked={simpleView}
                onChange={() => setSimpleView(!simpleView)}
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
            placeholder="Filter list"
            onChange={handleFilterFiles}
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
            <Header size="large" content="Selected file" />
            {agent === 'sas' && <FileDetailed file={files.filter(file => `${file.folder}/${file.filename}` === selectedFile)[0]} />}
            {agent === 'agent' && <SelectFileOperation file={files.filter(file => `${file.folder}/${file.filename}` === selectedFile)[0]} />}
          </Sticky>
          }
        </Grid.Column>
      </Grid>
    </Ref>
  )
}

export default SelectFile

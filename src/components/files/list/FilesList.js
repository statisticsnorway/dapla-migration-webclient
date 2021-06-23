import { Checkbox, Header, Icon, Item, List } from 'semantic-ui-react'

function FilesList ({ files, selectedFile, handleCheckbox }) {
  return files.map(file => {
    const created = new Date(file.created)
    const modified = new Date(file.modified)
    const fullFilename = `${file.folder}/${file.filename}`
    const checked = selectedFile === fullFilename
    const fileSizeKB = file.size * 0.0009765625
    let fileSize = fileSizeKB
    let fileSizeUnit = 'kB'

    if (fileSizeKB.toFixed(0).toString().length >= 5) {
      fileSize = file.size * 0.00000095367432
      fileSizeUnit = 'MB'
    }

    return (
      <Item key={fullFilename} onClick={() => handleCheckbox(fullFilename)}>
        <Item.Content>
          <Item.Header as={Header} size="small">
            {file.filename}
            <Checkbox
              checked={checked}
              style={{ marginLeft: '0.5rem', paddingTop: '0.15rem' }}
            />
          </Item.Header>
          <Item.Meta style={{ marginBottom: 0 }}>
            <Icon name="folder" style={{ marginRight: '0.3rem' }} />
            {file.folder}
          </Item.Meta>
          <Item.Extra style={{ marginTop: 0 }}>
            <List horizontal>
              <List.Item>{`Size: ${fileSize.toFixed(0)} ${fileSizeUnit}`}</List.Item>
              <List.Item>{`Created: ${created.toLocaleDateString()}`}</List.Item>
              <List.Item>{`Modified: ${modified.toLocaleDateString()}`}</List.Item>
            </List>
          </Item.Extra>
        </Item.Content>
      </Item>
    )
  })
}

export default FilesList

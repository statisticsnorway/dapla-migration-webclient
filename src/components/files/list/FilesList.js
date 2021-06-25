import { useContext } from 'react'
import { Checkbox, Header, Icon, Item, List } from 'semantic-ui-react'

import { LanguageContext } from '../../../context/AppContext'
import { FILE } from '../../../configurations'
import { APP_STEPS } from '../../../enums'

function FilesList ({ files, selectedFile, handleCheckbox }) {
  const { language } = useContext(LanguageContext)

  return files.map(file => {
    const fileDetails = FILE.createFileDetails(file)
    const checked = selectedFile === fileDetails.fullFilename

    return (
      <Item
        key={fileDetails.fullFilename}
        onClick={() => handleCheckbox(fileDetails.fullFilename)}
        style={{ backgroundColor: checked ? 'rgb(0, 181, 173, .1)' : '#fff', marginBottom: 0 }}
      >
        <Item.Content style={{ paddingBottom: 0 }}>
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
              <List.Item>
                {`${APP_STEPS.LIST.FILE.SIZE[language]}: ${fileDetails.size.toFixed(0)} ${fileDetails.unit}`}
              </List.Item>
              <List.Item>
                {`${APP_STEPS.LIST.FILE.CREATED[language]}: ${fileDetails.created.toLocaleDateString()}`}
              </List.Item>
              <List.Item>
                {`${APP_STEPS.LIST.FILE.MODIFIED[language]}: ${fileDetails.modified.toLocaleDateString()}`}
              </List.Item>
            </List>
          </Item.Extra>
        </Item.Content>
      </Item>
    )
  })
}

export default FilesList

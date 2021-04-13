import { Checkbox, List } from 'semantic-ui-react'

function FilesListSimple ({ files, filesToCopy, handleCheckbox }) {
  return files.map(file => {
    const fullFilename = `${file.folder}/${file.filename}`
    const includes = filesToCopy.includes(fullFilename)

    return <List.Item key={file.filename} onClick={() => handleCheckbox(includes, fullFilename)}>
      {fullFilename}
      <Checkbox
        checked={includes}
        style={{ marginLeft: '0.5rem', paddingTop: '0.3rem' }}
      />
    </List.Item>
  })
}

export default FilesListSimple

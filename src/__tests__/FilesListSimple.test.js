import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'

import FilesListSimple from '../components/files/list/FilesListSimple'
import { AppContextProvider } from '../context/AppContext'
import { TEST_CONFIGURATIONS } from '../configurations'

const { testFileObjects, testFile } = TEST_CONFIGURATIONS
const handleCheckbox = jest.fn()

const setup = () => {
  const { getByText } = render(
    <AppContextProvider>
      <FilesListSimple files={testFileObjects} selectedFile={testFile.file} handleCheckbox={handleCheckbox} />
    </AppContextProvider>
  )

  return { getByText }
}

test('Renders correctly', () => {
  const { getByText } = setup()

  testFileObjects.forEach(file => {
    expect(getByText(`${file.folder}/${file.filename}`)).toBeInTheDocument()
  })

  userEvent.click(getByText(`${testFileObjects[1].folder}/${testFileObjects[1].filename}`))

  expect(handleCheckbox).toHaveBeenCalledWith(`${testFileObjects[1].folder}/${testFileObjects[1].filename}`)
})

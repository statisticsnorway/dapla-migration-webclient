import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import SelectFileOperation from '../../../components/files/list/SelectFileOperation'
import { API, TEST_CONFIGURATIONS } from '../../../configurations'

const { testFileObjects } = TEST_CONFIGURATIONS

const setup = (file = testFileObjects[0]) => {
  const { getByText } = render(
    <MemoryRouter initialEntries={['/']}>
      <SelectFileOperation file={file} />
    </MemoryRouter>
  )

  return { getByText }
}

test('Renders correctly', () => {
  const { getByText } = setup()

  expect(getByText(API.OPERATIONS[0])).toBeInTheDocument()
})

test('Renders correctly on unsupported file formats', () => {
  const { getByText } = setup({ filename: '/test/a/path/file.json' })

  expect(getByText(API.OPERATIONS[2])).toBeDisabled()
})

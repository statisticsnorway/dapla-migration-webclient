import '@testing-library/jest-dom/extend-expect'

jest.mock('axios-hooks')

window.__ENV = {
  REACT_APP_API: process.env.REACT_APP_API
}

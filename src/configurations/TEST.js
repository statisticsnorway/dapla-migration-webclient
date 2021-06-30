import { LANGUAGE } from '@statisticsnorway/dapla-js-utilities'

export const TEST_CONFIGURATIONS = {
  alternativeApi: 'http://localhost:9999',
  apiContext: (fn, fn2, fn3) => ({
    api: window.__ENV.REACT_APP_API,
    setApi: fn,
    advancedUser: false,
    setAdvancedUser: fn2,
    devToken: '',
    setDevToken: fn3
  }),
  errorString: 'A problem occurred',
  language: LANGUAGE.LANGUAGES.NORWEGIAN.languageCode,
  otherLanguage: LANGUAGE.LANGUAGES.ENGLISH.languageCode
}

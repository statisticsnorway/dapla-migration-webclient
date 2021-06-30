import { createContext, useState } from 'react'
import { LANGUAGE } from '@statisticsnorway/dapla-js-utilities'

export const ApiContext = createContext({
  devToken: '',
  advancedUser: false,
  api: window.__ENV.REACT_APP_API
})

export const LanguageContext = createContext(LANGUAGE.LANGUAGES.NORWEGIAN.languageCode)

export const AppContextProvider = (props) => {
  const [api, setApi] = useState(window.__ENV.REACT_APP_API)
  const [language, setLanguage] = useState(LANGUAGE.LANGUAGES.NORWEGIAN.languageCode)
  const [devToken, setDevToken] = useState(localStorage.getItem('devToken') || '')
  const [advancedUser, setAdvancedUser] = useState(
    localStorage.getItem('advancedUser') !== null ?
      localStorage.getItem('advancedUser') === 'true' ? true
        :
        localStorage.getItem('advancedUser') === 'false' ? false
          :
          false
      :
      false
  )

  return (
    <ApiContext.Provider value={{ api, setApi, devToken, setDevToken, advancedUser, setAdvancedUser }}>
      <LanguageContext.Provider value={{ language, setLanguage }}>
        {props.children}
      </LanguageContext.Provider>
    </ApiContext.Provider>
  )
}

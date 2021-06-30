import { useContext, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Checkbox, Dropdown, Header, Image, Menu, Sticky } from 'semantic-ui-react'
import {
  dapla_long_rgb,
  dapla_short_rgb,
  LANGUAGE,
  ssb_logo_no_text_rgb,
  ssb_logo_rgb
} from '@statisticsnorway/dapla-js-utilities'

import { ApiContext, LanguageContext } from '../context/AppContext'
import { TEST_IDS, UI } from '../enums'

function AppMenu ({ setSettingsOpen, context }) {
  const { language, setLanguage } = useContext(LanguageContext)
  const { advancedUser, setAdvancedUser } = useContext(ApiContext)

  let history = useHistory()

  const [menuIsStuck, setMenuIsStuck] = useState(false)

  const handleAdvancedUserChange = () => {
    if (advancedUser) {
      history.push({ pathname: '/' })
    }

    localStorage.setItem('advancedUser', !advancedUser ? 'true' : 'false')
    setAdvancedUser(!advancedUser)
  }

  return (
    <Sticky onUnstick={() => setMenuIsStuck(false)} onStick={() => setMenuIsStuck(true)} context={context}>
      <Menu
        secondary
        size={menuIsStuck ? 'large' : 'huge'}
        style={{
          backgroundColor: '#fff',
          padding: menuIsStuck ? 0 : '1rem',
          border: '1px solid rgba(34,36,38,.15)',
          boxShadow: '0 1px 2px 0 rgba(34,36,38,.15)'
        }}
      >
        <Menu.Item as={Link} to="/">
          <Image size={menuIsStuck ? 'mini' : 'medium'} src={menuIsStuck ? ssb_logo_no_text_rgb : ssb_logo_rgb} />
        </Menu.Item>
        <Menu.Item>
          <Image size={menuIsStuck ? 'mini' : 'tiny'} src={menuIsStuck ? dapla_short_rgb : dapla_long_rgb} />
        </Menu.Item>
        <Menu.Item>
          <Header size={menuIsStuck ? 'medium' : 'huge'} content={UI.HEADER[language]} />
        </Menu.Item>
        <Menu.Menu position="right">
          <Menu.Item>
            <Checkbox
              toggle
              checked={advancedUser}
              label={UI.ADVANCED_USER[language]}
              data-testid={TEST_IDS.ADVANCED_USER_TOGGLE}
              onChange={() => handleAdvancedUserChange()}
            />
          </Menu.Item>
          {advancedUser &&
          <Menu.Item
            onClick={() => setSettingsOpen(true)}
            data-testid={TEST_IDS.SETTINGS_BUTTON}
            icon={{ name: 'cog', color: 'blue', size: menuIsStuck ? 'large' : 'big' }}
          />
          }
          <Dropdown item text={`${LANGUAGE.LANGUAGE[language]} (${LANGUAGE.LANGUAGE_CHOICE[language]})`}>
            <Dropdown.Menu>
              {Object.keys(LANGUAGE.LANGUAGES).map(languageName =>
                <Dropdown.Item
                  key={languageName}
                  content={LANGUAGE[languageName][language]}
                  onClick={() => setLanguage(LANGUAGE.LANGUAGES[languageName].languageCode)}
                />
              )}
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Menu>
      </Menu>
    </Sticky>
  )
}

export default AppMenu

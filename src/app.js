import React, { Component } from 'react'
import codePush from 'react-native-code-push'

import { Router, Scene } from 'react-native-mobx'
import { Provider } from 'mobx-react/native'

import LoginScreen from './views/login_screen'
import HomeScreen from './views/home_screen'
import SettingScreen from './views/setting_screen'
import ChatScreen from './views/chat_screen'

import appStore from './store/AppStore'

class App extends Component {
  render() {
    return (
      <Provider appStore={appStore}>
        <Router>
          <Scene
            key="login"
            component={LoginScreen}
            duration={1}
            hideNavBar
            initial
          />
          <Scene
            key="home"
            component={HomeScreen}
            duration={1}
            hideNavBar
          />
          <Scene
            key="chat"
            component={ChatScreen}
            hideNavBar={false}
            panHandlers={null}
            duration={0}
          />
          <Scene
            key="setting"
            component={SettingScreen}
            hideNavBar={false}
            title="Edit your profile"
            panHandlers={null}
            duration={0}
          />
        </Router>
      </Provider>
    )
  }
}

export default App
//export default App = codePush({ updateDialog: true, installMode: codePush.InstallMode.IMMEDIATE })(App)

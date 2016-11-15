import React, { Component } from 'react'

import { Router, Scene } from 'react-native-mobx'
import { Provider } from 'mobx-react/native'

import LoginScreen from './views/login_screen'
import HomeScreen from './views/home_screen'
import SettingScreen from './views/setting_screen'

import appStore from './store/AppStore'

export default class App extends Component {
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
            key="setting"
            component={SettingScreen}
            hideNavBar={false}
            title="Edit your profile"
            panHandlers={null}
            duration={1}
          />
        </Router>
      </Provider>
    )
  }
}

import React, { Component } from 'react'
import codePush from 'react-native-code-push'
import OneSignal from 'react-native-onesignal'

import { Router, Scene, Actions } from 'react-native-mobx'
import { Provider } from 'mobx-react/native'

import LoginScreen from './views/login_screen'
import HomeScreen from './views/home_screen'
import SettingScreen from './views/setting_screen'
import ChatScreen from './views/chat_screen'

import appStore from './store/AppStore'

class App extends Component {
  componentDidMount() {
    console.log("-------xx------ App - componentDidMount ------xx-------")
    OneSignal.inFocusDisplaying(0)
    OneSignal.configure({
      onNotificationReceived: function(notification) {
        //console.log('NOTIFICATION RECEIVED: ', notification)
        if (notification.payload.additionalData.new_message && appStore.current_puid != notification.payload.additionalData.puid) {
          console.log("       appStore.new_messages + 1 : " + appStore.current_puid)
          appStore.new_messages = appStore.new_messages + 1
        }
      },
      onNotificationOpened: function(openResult) {
        console.log(openResult);
        console.log('MESSAGE: ', openResult.notification.payload.body)
        console.log('CURRENT PUID:' + appStore.current_pui)
        console.log('ISACTIVE: ', openResult.notification.isAppInFocus)
        console.log('DATA: ', openResult.notification.payload.additionalData)
        if (!openResult.notification.isAppInFocus) {
          if (openResult.notification.payload.additionalData) {
            if (appStore.current_puid != openResult.notification.payload.additionalData.puid) {
              Actions.login({ type: 'replace', postProps:openResult.notification.payload.additionalData })
            }
          }
          else {
            Actions.login({ type: 'replace', postProps:null })
          }
        }
      }
    })
  }
  render() {
    console.disableYellowBox = true
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
            //direction="vertical"
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

//export default App
//export default App = codePush({ updateDialog: true, installMode: codePush.InstallMode.IMMEDIATE })(App)
export default App = codePush()(App)

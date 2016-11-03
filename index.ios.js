import React, { Component } from 'react'
import { AppRegistry } from 'react-native'

import AppStorage from './src/app_storage'

class MyApp extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <AppStorage />
    )
  }
}

AppRegistry.registerComponent('MyApp', () => MyApp)

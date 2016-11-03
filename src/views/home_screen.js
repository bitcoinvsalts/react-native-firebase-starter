/**
 * Home screen
 * ScrollableTabView is used for different screens
 */

import React, { Component } from 'react'
import {
  Text,
  View,
  StatusBar,
  ScrollView,
  StyleSheet
} from 'react-native'
import { connect } from 'react-redux'
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view'
import { firebaseApp } from '../firebase'
import { getColor } from '../components/config'
import { signedOut } from '../actions'
import NavigationTab from '../components/home_screen/navTab'
import Timeline from '../components/home_screen/timeline'
import CreateNew from '../components/home_screen/createNew'
import Settings from '../components/home_screen/settings'
import LoginScreen from './login_screen'

class HomeScreen extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
        backgroundColor={getColor('googleBlue700')}
        barStyle='light-content'
        animated={true}
        />
        <ScrollableTabView
        initialPage={0}
        style={{borderTopWidth:0}}
        renderTabBar={() => <NavigationTab />}>
          <Timeline tabLabel="md-globe" navigator={this.props.navigator}/>
          <CreateNew tabLabel="md-add"/>
          <Settings
          tabLabel="ios-settings"
          onLogOut={ () => {this._onLogOut()} }
          />
        </ScrollableTabView>
      </View>
    )
  }

  _onLogOut = () => {
    firebaseApp.auth().signOut().then(() => {
      this.props.navigator.resetTo({ view: LoginScreen })
      this.props.signedOut()
    })
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  }
})

export default connect(null, {signedOut})(HomeScreen)

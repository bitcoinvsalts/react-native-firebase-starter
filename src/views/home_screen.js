import React, { Component } from 'react'
import {
  View,
  StatusBar,
  StyleSheet
} from 'react-native'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import { getColor } from '../components/config'
import NavigationTab from '../components/home_screen/navTab'
import Timeline from '../components/home_screen/timeline'
import CreateNew from '../components/home_screen/createNew'
import Settings from '../components/home_screen/settings'


export default class HomeScreen extends Component {
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
          <Timeline tabLabel="md-globe"/>
          <CreateNew tabLabel="md-add"/>
          <Settings tabLabel="ios-settings"/>
        </ScrollableTabView>
      </View>
    )
  }

  componentWillUnmount() {
    console.log("---- HOME UNMOUNT ---")
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  }
})

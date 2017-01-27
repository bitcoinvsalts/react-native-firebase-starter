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
import Profile from '../components/home_screen/profile'
import MyOrders from '../components/home_screen/myOrders'
import MyChats from '../components/home_screen/myChats'
import { Actions } from 'react-native-mobx'
import { observer, inject } from 'mobx-react/native'


@inject("appStore") @observer
export default class HomeScreen extends Component {
  constructor(props) {
    super(props)
    if (this.props.postProps) {
      console.log(" ------->>>> OPENING CHAT ROOM :::: " + this.props.postProps.puid)
      Actions.chat({ puid:this.props.postProps.puid })
    }
  }

  componentWillMount() {
    console.log("--------- HOME ---------");
    this.props.appStore.tracker.trackScreenView('Home')
    this.props.appStore.current_page = 'home'
    this.props.appStore.current_puid = ''
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
          <Timeline tabLabel="globe"/>
          <MyChats tabLabel="chat"/>
          <CreateNew tabLabel="plus"/>
          <Profile tabLabel="user"/>
          <MyOrders tabLabel="shopping-basket"/>
        </ScrollableTabView>
      </View>
    )
  }

  componentWillUnmount() {
    console.log("---- HOME UNMOUNT ---")
    this.props.appStore.current_page = ''
    this.props.appStore.current_puid = ''
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  }
})

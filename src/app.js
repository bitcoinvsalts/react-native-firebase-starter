/**
 * this is the main application component
 * it is used to configure the navigator
 * and lock to screen to portrait mode only
 * this will also determine what screen to show
 * according to the signed in status of the user
 */

import React, { Component } from 'react'
import {
  Navigator,
  View
} from 'react-native'
import { connect } from 'react-redux'

// import the login screen view and
// add it as the first component to render
// added HomeScreen to debug
import LoginScreen from './views/login_screen'
import HomeScreen from './views/home_screen'

class App extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    // base route stack to render
    // based on signed status of the user
    console.log("YOOOOOO");
    let navigator
    console.log(this.props.currentUser);
    if (this.props.currentUser.signInStatus) {
      console.log("--- SIGNED IN ---");
      const routes = [
        { view: HomeScreen },
        { view: LoginScreen },
      ]
      navigator =
        <Navigator
          style={{ flex: 1 }}
          initialRoute={routes[0]}
          initialRouteStack={routes}
          renderScene={this._renderScene}
          configureScene={this._configureScene}
        />
    } else {
      console.log("--- NOT SIGNED IN ---");
      const routes = [
        { view: LoginScreen },
        //{ view: HomeScreen },
      ]
      navigator =
        <Navigator
          style={{ flex: 1 }}
          initialRoute={routes[0]}
          initialRouteStack={routes}
          renderScene={this._renderScene}
          configureScene={this._configureScene}
        />
    }

    return (
      <View style={{flex: 1}}>
        {navigator}
      </View>
    )
  }

  _renderScene(route, navigator) {
    return <route.view navigator={navigator} {...route}/>
  }

  _configureScene(route, routeStack) {
    return {
      ...Navigator.SceneConfigs.FloatFromRight,
    };
  }
}

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser
  }
}

export default connect(mapStateToProps)(App)

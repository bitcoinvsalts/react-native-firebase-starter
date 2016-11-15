import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  StatusBar,
  StyleSheet,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { getColor } from '../components/config'
import LogoCircle from '../components/login_screen/logo_circle'
import InitialView from '../components/login_screen/initial_view'
import SignInForm from '../components/login_screen/signIn_form'
import SignUpForm from '../components/login_screen/signUp_form'
import ForgotPassForm from '../components/login_screen/forgotPassword_form'
import { firebaseApp } from '../firebase'
import { inject, observer } from 'mobx-react/native'
import { Actions } from 'react-native-mobx'

@inject ('appStore') @observer
export default class LoginScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      initialRun: true,
      initialScreen: false,
      signIn: false,
      signUp: false,
      forgotPass: false
    }
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true)
    }
    _unsubscribe = firebaseApp.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log(" --- User Signed In ---> " + user.displayName)
        this.props.appStore.user = user
        this.props.appStore.username = user.displayName
        Actions.home({ type: 'replace' })
      }
      else {
        console.log(" --- User is Signed Off --- ")
        this.setState({initialScreen: true})
      }
      _unsubscribe()
    })
  }

  componentWillUnmount() {
  }

  componentWillMount() {
  }

  componentDidMount() {
    this.setState({initialRun: false})
  }

  componentDidUpdate() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
  }

  render() {
    //const animationDelay = this.state.initialRun ? 500 : 0

    const initialView = this.state.initialScreen ?
      <InitialView
      onSignIn={this._onSignIn}
      onSignUp={this._onSignUp}
      animDelay={0}/>
    : null

    const signIn = this.state.signIn ?
      <SignInForm
      onBackFromSignIn={this._onBackFromSignIn}
      onForgotPass = {this._onForgotPass} />
    : null

    const signUp = this.state.signUp ?
      <SignUpForm
      onBackFromSignUp={this._onBackFromSignUp} />
    : null

    const fogotPass = this.state.forgotPass ?
      <ForgotPassForm
      onBackFromForgotPass={this._onBackFromForgotPass} />
    : null

    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor={getColor('googleBlue700')}
          barStyle='light-content'
          animated={true}
        />
        <View style={styles.logoContainer}>
          <TouchableOpacity onPress={this._onLogoClicked}>
            <LogoCircle />
          </TouchableOpacity>
        </View>
        <KeyboardAwareScrollView>
          { initialView }
          { signIn }
          { signUp }
          { fogotPass }
        </KeyboardAwareScrollView>
      </View>
    )
  }

  _onLogoClicked = () => {
    this.setState({
      initialScreen: true,
      signIn: false,
      signUp: false,
      forgotPass: false
    })
  }

  _onSignIn = () => {
    this.setState({
      initialScreen: false,
      signIn: true
    })
  }

  _onBackFromSignIn = () => {
    this.setState({
      initialScreen: true,
      signIn: false
    })
  }

  _onSignUp = () => {
    this.setState({
      initialScreen: false,
      signUp: true
    })
  }

  _onBackFromSignUp = () => {
    this.setState({
      initialScreen: true,
      signUp: false
    })
  }

  _onForgotPass = () => {
    this.setState({
      initialScreen: false,
      signIn: false,
      signUp: false,
      forgotPass: true
    })
  }

  _onBackFromForgotPass = () => {
    this.setState({
      initialScreen: true,
      forgotPass: false
    })
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: '#FFFFFF'
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 260,
  }
})

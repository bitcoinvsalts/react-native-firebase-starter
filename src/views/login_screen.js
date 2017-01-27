import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  StatusBar,
  StyleSheet,
  Image
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { getColor } from '../components/config'
import Background from '../components/background'
import InitialView from '../components/login_screen/initial_view'
import SignInForm from '../components/login_screen/signIn_form'
import SignUpForm from '../components/login_screen/signUp_form'
import ForgotPassForm from '../components/login_screen/forgotPassword_form'
import { firebaseApp } from '../firebase'
import { observer, inject } from 'mobx-react/native'
import { Actions } from 'react-native-mobx'
import OneSignal from 'react-native-onesignal'


@inject("appStore") @observer
export default class LoginScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
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
        console.log("--------- LOGGED AS " + user.displayName + " ---------")
        this.props.appStore.user = user
        this.props.appStore.username = user.displayName
        firebaseApp.database().ref('users').child(user.uid).once('value')
        .then((snapshot) => {
          this.props.appStore.post_count = parseInt(snapshot.val().post_count)
          this.props.appStore.order_count = parseInt(snapshot.val().order_count)
          this.props.appStore.chat_count = parseInt(snapshot.val().chat_count)
        })
        Actions.home({ type:'replace', postProps:this.props.postProps })
      }
      else {
        this.setState({ initialScreen: true })
      }
      _unsubscribe()
    })
  }

  componentWillUnmount() {
  }

  componentWillMount() {
    this.props.appStore.current_page = 'login'
    this.props.appStore.current_puid = ''
  }

  componentDidMount() {
  }

  componentDidUpdate() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
  }

  render() {
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
        <View style={styles.rowcontainer}>
          <Background imgSrouce={require('../assets/images/bk.png')}/>
          <KeyboardAwareScrollView>
            <StatusBar
              backgroundColor={getColor('googleBlue700')}
              barStyle='light-content'
              animated={true}
            />
            <View style={styles.logoContainer}>
              <TouchableOpacity onPress={this._onLogoClicked}>
                <Image source={require('../assets/images/myapp.png')} style={styles.logoImage}/>
              </TouchableOpacity>
            </View>
            { initialView }
            { signIn }
            { signUp }
            { fogotPass }
          </KeyboardAwareScrollView>
        </View>
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
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowcontainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage : {
    height: 220,
    width: 220,
  },
})

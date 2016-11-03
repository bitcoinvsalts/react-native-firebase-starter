/**
 * this is the sign in form of the login screen
 */

import React, { Component } from 'react'
import {
  View,
  Text,
  TextInput,
  BackAndroid,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  StyleSheet
} from 'react-native'
import { connect } from 'react-redux'
import { signIn } from '../../actions'
import { getColor } from '../config'
import { firebaseApp } from '../../firebase'
import * as Animatable from 'react-native-animatable'

class SignInForm extends Component {
  constructor(props) {
    super(props)

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true)
    }

    this.state = {
      init: true,
      errMsg: null,
      forgotPass: false,
      email: '',
      password: ''
    }
  }

  componentDidMount() {
    BackAndroid.addEventListener('backBtnPressed', this._handleBackBtnPress)
  }

  componentDidUpdate() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
  }

  componentWillUnmount() {
    BackAndroid.removeEventListener('backBtnPressed', this._handleBackBtnPress)
  }

  render() {
    const animation = this.state.init ? 'bounceInUp' : 'bounceOutDown'
    const errorMessage = this.state.errMsg ? <Text style={styles.errMsg}>{this.state.errMsg}</Text> : null

    return (
      <Animatable.View
      animation={animation}
      style={styles.container}
      onAnimationEnd={this._handleAnimEnd}>
        <Text style={styles.title}>Sign In</Text>
        {errorMessage}
        <View style={[styles.inputContainer, { marginBottom: 10 }]}>
          <TextInput
          style={styles.inputField}
          underlineColorAndroid='transparent'
          placeholder='Email'
          keyboardType='email-address'
          placeholderTextColor='rgba(255,255,255,.6)'
          value={this.state.email}
          onSubmitEditing={(event) => {
            this.refs.SecondInput.focus();
          }}
          onChangeText={(text) => this.setState({ email: text })}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
          ref='SecondInput'
          style={styles.inputField}
          underlineColorAndroid='transparent'
          placeholder='Password'
          secureTextEntry={true}
          placeholderTextColor='rgba(255,255,255,.6)'
          value={this.state.password}
          onSubmitEditing={(event) => {this._handleSignIn()}}
          onChangeText={(text) => this.setState({ password: text })}
          />
        </View>
        <View style={styles.btnContainers}>
          <TouchableOpacity onPress={this._handleForgotPassword}>
            <View style={styles.fogotBtnContainer}>
              <Text style={styles.forgotBtn}>{'Forgot Password?'.toUpperCase()}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._handleSignIn}>
            <View style={styles.submitBtnContainer}>
              <Text style={styles.submitBtn}>{'Let\'s Go'.toUpperCase()}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    )
  }

  _handleForgotPassword = () => {
    this.setState({ init: false, forgotPass: true })
  }

  _handleSignIn = () => {
    this.setState({errMsg: 'Signing In...'})
    if (this.state.email.length == 0) {
      this.setState({errMsg: "Please enter your email."})
    }
    else if (this.state.password.length == 0) {
      this.setState({errMsg: "Please enter your passowrd."})
    }
    else {
      firebaseApp.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
      .then((user) => {
        const uid = user.uid;
        console.log("--------");
        console.log("user uid: " + uid);
        console.log("--------");
        firebaseApp.database().ref('users').child(uid).once('value')
        .then((snapshot) => {
          console.log(snapshot.val());
          this.props.goToHomeScreen(snapshot.val().name, snapshot.val().email, snapshot.val().uid)
          /*
          setTimeout(()=> {
            this._handleGoBack()
          }, 1000)
          */
        })
      })
      .catch((error) => {
        this.setState({ errMsg: error.message })
      })
    }
  }

  _handleGoBack = () => {
    this.setState({ init: false })
  }

  _handleBackBtnPress = () => {
    this._handleGoBack()
    return true
  }

  _handleAnimEnd = () => {
    if (this.state.forgotPass) {
      this.props.onForgotPass()
    } else if (!this.state.init) {
      this.props.onBackFromSignIn()
    }
  }
}

function mapStateToProps(state) {
  return { currentUser: state.currentUser }
}

export default connect(mapStateToProps, {signIn})(SignInForm)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20
  },
  title: {
    fontSize: 25,
    marginBottom: 10,
    color: 'rgba(255,255,255,.8)'
  },
  errMsg: {
    width: 280,
    textAlign: 'center',
    alignSelf: 'center',
    color: '#ffffff',
    marginBottom: 10,
    fontSize: 14,
  },
  inputContainer: {
    backgroundColor: 'rgba(255,255,255,.3)',
    borderRadius: 5
  },
  inputField: {
    width: 280,
    height: 40,
    paddingLeft: 15,
    paddingRight: 15,
    color: '#ffffff'
  },
  btnContainers: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 280
  },
  fogotBtnContainer: {

  },
  forgotBtn: {
    fontSize: 12,
    color: '#ffffff'
  },
  submitBtnContainer: {
    width: 120,
    height: 40,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  submitBtn: {
    fontSize: 12,
    color: getColor()
  }
})

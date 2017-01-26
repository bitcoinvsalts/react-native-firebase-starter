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
import { getColor } from '../config'
import * as Animatable from 'react-native-animatable'
import { firebaseApp } from '../../firebase'

export default class ForgotPassForm extends Component {
  constructor(props) {
    super(props)

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true)
    }

    this.state = {
      init: true,
      errMsg: null,
      email: ''
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
    const errorMessage = this.state.errMsg ?
      <Text style={styles.errMsg}>{this.state.errMsg}</Text>
    : null

    return (
      <Animatable.View
      animation={animation}
      style={styles.container}
      onAnimationEnd={this._handleAnimEnd}>
        <Text style={styles.title}>Forgot Password</Text>
        {errorMessage}
        <View style={[styles.inputContainer, { marginBottom: 10 }]}>
          <TextInput
          style={styles.inputField}
          underlineColorAndroid='transparent'
          placeholder='Enter Your Email'
          autoCapitalize='none'
          placeholderTextColor='rgba(255,255,255,.6)'
          onChangeText={(text) => this.setState({ email: text })}
          onSubmitEditing={(event) => {this._handleForgotPass()}}
          />
        </View>
        <View style={styles.btnContainers}>
          <TouchableOpacity onPress={this._handleForgotPass}>
            <View style={styles.submitBtnContainer}>
              <Text style={styles.submitBtn}>{'Recover My Password'.toUpperCase()}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    )
  }

  _handleForgotPass = () => {
    this.setState({errMsg: 'Please Wait...'})
    if (this.state.email.length == 0) {
      this.setState({errMsg: "Please enter your email."})
    }
    else {
      firebaseApp.auth().sendPasswordResetEmail(this.state.email)
      .then(()=> {
        this.setState({errMsg: 'An email has been sent!'})
        setTimeout(()=> {
          this._handleGoBack()
        }, 3000)
      }).catch((error) => {
        this.setState({errMsg: error.message})
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
    if (!this.state.init) {
      this.props.onBackFromForgotPass()
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 40,
    alignItems: 'center',
    paddingBottom: 20,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    color: '#fff',
    backgroundColor: 'transparent',
  },
  errMsg: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 10,
    backgroundColor: 'transparent',
  },
  inputContainer: {
    backgroundColor: 'rgba(0,0,0,.3)',
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
    marginTop: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 280
  },
  submitBtnContainer: {
    width: 240,
    height: 40,
    backgroundColor: '#ddd',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  submitBtn: {
    fontSize: 16,
    fontWeight: '800',
    color: getColor()
  }
})

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
import { firebaseApp } from '../../firebase'
import { getColor } from '../config'
import * as Animatable from 'react-native-animatable'
import { Actions } from 'react-native-mobx'
import { observer } from 'mobx-react/native'


@observer(['appStore'])
export default class SignUpForm extends Component {
  constructor(props) {
    super(props)
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true)
    }
    this.state = {
      init: true,
      errMsg: null,
      signUpSuccess: false,
      name: '',
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

    const errorMessage = this.state.errMsg ?
      <Text style={styles.errMsg}>{this.state.errMsg}</Text>
    : null

    const signUpForm = this.state.signUpSuccess ?
      null
    :
      <View>
        <View style={[styles.inputContainer, { marginBottom: 10 }]}>
          <TextInput
          style={styles.inputField}
          value={this.state.name}
          onChangeText={(text) => this.setState({ name: text })}
          autoCapitalize='words'
          autoCorrect={false}
          underlineColorAndroid='transparent'
          placeholder='Your Name'
          placeholderTextColor='rgba(255,255,255,.6)'
          onSubmitEditing={(event) => {
            this.refs.SecondInput.focus();
          }}
          />
        </View>
        <View style={[styles.inputContainer, { marginBottom: 10 }]}>
          <TextInput
          ref='SecondInput'
          style={styles.inputField}
          value={this.state.email}
          keyboardType='email-address'
          autoCorrect={false}
          onChangeText={(text) => this.setState({ email: text })}
          underlineColorAndroid='transparent'
          placeholder='Your Email'
          placeholderTextColor='rgba(255,255,255,.6)'
          onSubmitEditing={(event) => {
            this.refs.ThirdInput.focus();
          }}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
          ref='ThirdInput'
          style={styles.inputField}
          value={this.state.password}
          onChangeText={(text) => this.setState({ password: text })}
          onSubmitEditing={(event) => {this._handleSignUp()}}
          underlineColorAndroid='transparent'
          placeholder='Choose Password'
          secureTextEntry={true}
          placeholderTextColor='rgba(255,255,255,.6)'
          />
        </View>
        <View style={styles.btnContainers}>
          <TouchableOpacity onPress={this._handleSignUp}>
            <View style={styles.submitBtnContainer}>
              <Text style={styles.submitBtn}>{'Let\'s Go'.toUpperCase()}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

    return (
      <Animatable.View
      animation={animation}
      style={styles.container}
      onAnimationEnd={this._handleAnimEnd}>
        <Text style={styles.title}>Sign Up</Text>
        {errorMessage}
        {signUpForm}
      </Animatable.View>
    )
  }

  _handleSignUp = () => {
    this.setState({errMsg: 'Signing Up...'})
    if (this.state.name.length < 5) {
      this.setState({errMsg: "Your name must be 5 characters long or more."})
    }
    else if (this.state.email.length == 0) {
      this.setState({errMsg: "Please enter your email."})
    }
    else if (this.state.password.length == 0) {
      this.setState({errMsg: "Please enter your passowrd."})
    }
    else {
      firebaseApp.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then((user) => {
        user.updateProfile({displayName: this.state.name})
        .then(() => {
          const uid = user.uid
          const username = user.displayName
          const email = user.email
          firebaseApp.database().ref('users/' + user.uid)
          .set({
            uid,
            username,
            email
          })
          this.props.appStore.uid = user.uid
          this.props.appStore.username = user.displayName
          Actions.home({ type: 'replace' })
        }, function(error) {
          console.log(error);
        });
      })
      .catch((error) => {
        this.setState({ errMsg: error.message });
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
      this.props.onBackFromSignUp()
    }
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
    marginTop: 10,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 25,
    marginBottom: 10,
    color: '#000'
  },
  errMsg: {
    color: '#000',
    fontSize: 12,
    marginBottom: 10,
    width: 280,
    textAlign: 'center',
    fontSize: 14,
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
    color: '#000'
  },
  btnContainers: {
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
    width: 280
  },
  submitBtnContainer: {
    width: 120,
    height: 40,
    backgroundColor: '#ddd',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  submitBtn: {
    fontSize: 20,
    fontWeight: '400',
    color: getColor()
  }
})

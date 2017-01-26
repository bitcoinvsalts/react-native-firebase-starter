import React, { Component } from 'react'
import {
  Text,
  TextInput,
  View,
  StatusBar,
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import { getColor } from '../components/config'
import { firebaseApp } from '../firebase'
import Icon from 'react-native-vector-icons/Ionicons'
import EvilIcon from 'react-native-vector-icons/EvilIcons'
import { observer,inject } from 'mobx-react/native'
import { Actions } from 'react-native-mobx'
import OneSignal from 'react-native-onesignal'


@inject("appStore") @observer
export default class SettingScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      init: true,
      errMsg: null,
      saveUpSuccess: false,
      name: this.props.appStore.user.displayName,
      email: this.props.appStore.user.email,
      password: ''
    }
  }

  componentDidMount() {
    console.log("--------- SETTINGS --------- ")
  }

  componentWillUnmount() {
    console.log("---- SETTINGS UNMOUNT ---")
  }

  render() {
    const errorMessage = this.state.errMsg ?
      <Text style={styles.errMsg}>{this.state.errMsg}</Text>
    : null
    return (
      <View style={styles.container}>
        <StatusBar
        backgroundColor={getColor('googleBlue700')}
        barStyle='light-content'
        animated={true}
        />
        <View>
          {errorMessage}
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
            />
          </View>
          <View style={[styles.inputContainer, { marginBottom: 10 }]}>
            <TextInput
            ref='SecondInput'
            style={styles.inputField}
            value={this.state.email}
            keyboardType='email-address'
            autoCorrect={false}
            autoCapitalize='none'
            onChangeText={(text) => this.setState({ email: text })}
            underlineColorAndroid='transparent'
            placeholder='Your Email'
            placeholderTextColor='rgba(255,255,255,.6)'
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
            ref='ThirdInput'
            style={styles.inputField}
            value={this.state.password}
            onChangeText={(text) => this.setState({ password: text })}
            underlineColorAndroid='transparent'
            placeholder='Choose Password'
            secureTextEntry={true}
            placeholderTextColor='rgba(255,255,255,.6)'
            />
          </View>
          <View style={styles.btnContainers}>
          <TouchableOpacity onPress={this._handleCancel}>
            <View style={styles.submitBtnContainer}>
              <Text style={styles.submitBtn}>{'BACK'}</Text>
            </View>
          </TouchableOpacity>
            <TouchableOpacity onPress={this._handleSave}>
              <View style={styles.submitBtnContainer}>
                <Text style={styles.submitBtn}>{'SAVE'}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  _handleCancel = () => {
    Actions.pop()
  }

  _handleSave = () => {
    console.log("USER EDIT SAVING...")
    if (this.state.name != this.props.appStore.user.displayName) {
      if (this.state.name.length < 5) {
        this.setState({ errMsg: "Your name should be at least 5 characters." })
      }
      else {
        this.setState({ errMsg: "Saving your new name..." })
        firebaseApp.database().ref('usernameList').child(this.state.name.toLowerCase()).once('value')
        .then((snapshot) => {
          if (snapshot.val()) {
            this.setState({ errMsg: "Sorry username not available." })
          }
          else {
            this.props.appStore.username = this.state.name
            firebaseApp.database().ref('usernameList').child(this.props.appStore.user.displayName.toLowerCase()).remove()
            .then(() => {
              firebaseApp.database().ref('users').child(this.props.appStore.user.uid).update({username:this.state.name})
              firebaseApp.database().ref('usernameList').child(this.state.name.toLowerCase()).set(this.props.appStore.user.uid)
              this.props.appStore.user.updateProfile({ displayName: this.state.name })
              .then(() => {
                this.props.appStore.username = this.props.appStore.user.displayName
                OneSignal.sendTag("username", this.props.appStore.user.displayName)
                this.setState({ errMsg: "Name succesfully saved!" })
              })
              .catch((error) => {
                this.setState({ errMsg: error.message })
              })
            })
          }
        })
      }
    }
    if (this.state.email != this.props.appStore.user.email) {
      if (this.state.email.length == 0) {
        this.setState({ errMsg: "Please enter your email." })
      }
      else {
        this.setState({ errMsg: "Saving your new email..." })
        this.props.appStore.user.updateEmail(this.state.email)
        .then(() => {
          this.setState({ errMsg: "Email succesfully saved!" })
        })
        .catch((error) => {
          this.setState({ errMsg: error.message })
        })
      }
    }
    if (this.state.password) {
      if (this.state.password.length < 6) {
        this.setState({ errMsg: "Your password should be at least 6 characters." })
      }
      else {
        this.setState({ errMsg: "Saving your new password..." })
        this.props.appStore.user.updatePassword(this.state.password)
        .then(() => {
          this.setState({ errMsg: "Password succesfully saved!" })
        })
        .catch((error) => {
          this.setState({ errMsg: error.message })
        })
      }
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginRight: 50,
    marginLeft: 50,
    marginTop: 70,
    backgroundColor: '#ffffff'
  },
  errMsg: {
    color: '#000',
    fontSize: 12,
    marginBottom: 10,
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
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end'
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

import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Image
} from 'react-native'
import { getColor } from '../config'

export default class LogoCircle extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={styles.logoContainer}>
        <Image source={require('../../assets/images/jsapp.png')} style={styles.logoImage}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  logoContainer : {
    height: 400,
    width: 300,
    backgroundColor: '#fff',
    //borderRadius: 100,
    //elevation: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  logoImage : {
    height: 300,
    width: 300,
    //backgroundColor: '#333',
  },
  logoText : {
    fontSize: 60,
    color: getColor(),
    marginTop: 5,
    marginLeft: 5
  }
})

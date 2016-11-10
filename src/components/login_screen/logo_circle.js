import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet
} from 'react-native'
import { getColor } from '../config'

export default class LogoCircle extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>JSapp</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  logoContainer : {
    height: 200,
    width: 200,
    backgroundColor: '#ffffff',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 20,
  },
  logoText : {
    fontSize: 60,
    color: getColor(),
    marginTop: 5,
    marginLeft: 5
  }
})

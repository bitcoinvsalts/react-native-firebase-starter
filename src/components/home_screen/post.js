/**
 * individual post component
 */

import React, { Component } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native'

import { getColor } from '../config'

export default class Posts extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>
          {this.props.postTitle}
        </Text>
        <Text style={styles.name}>
          {this.props.posterName}
        </Text>
        <Text style={styles.time}>
          {this.props.postTime}
        </Text>
        <Text style={styles.content}>
          {this.props.postContent}
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  card: {
    flex: 0,
    borderWidth: 1,
    borderColor: '#e2e2e2',
    borderRadius: 2,
    backgroundColor: '#eee',
    padding: 10,
    margin: 5,
  },
  title: {
    fontSize: 20,
  },
  name: {
    color: getColor(),
    fontSize: 15,
    margin: 5,
  },
  time: {
    margin: 5,
    fontSize: 12,
    paddingBottom: 10
  },
  content: {
    color: 'rgba(0,0,0,.8)',
    fontSize: 14
  }
})

import React, { Component } from 'react'
import {
  Text,
  View,
  Image,
  StyleSheet,
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import FitImage from 'react-native-fit-image'
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
        <View style={styles.imageWrapper}>
          <FitImage indicator
          indicatorColor="black"
          indicatorSize="large"
          //resizeMode="contain"
          source={{ uri:this.props.imagePath }}
          />
        </View>
        <View style={styles.postInfo}>
          <Icon name='md-arrow-dropright' size={15} color='rgba(0,0,0,.5)' style={styles.itemIcon}/>
          <Text style={styles.username}>
            {this.props.posterName}
          </Text>
          <Text style={styles.time}>
            {this.props.postTime}
          </Text>
        </View>
        <Text style={styles.content}>
          {this.props.postContent}
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e2e2e2',
    borderRadius: 2,
    backgroundColor: '#eee',
    padding: 10,
    margin: 5,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 5,
  },
  postInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  itemIcon: {
    marginRight: 10
  },
  username: {
    color: getColor(),
    fontSize: 16,
    marginRight: 10,
  },
  time: {
    fontSize: 15,
  },
  content: {
    marginTop: 5,
    fontSize: 14
  },
  imageWrapper: {
    flex: 1,
    //flexDirection: 'row',
    backgroundColor: '#aaa',
  },

})

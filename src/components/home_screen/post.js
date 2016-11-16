import React, { Component } from 'react'
import {
  Text,
  View,
  Image,
  StyleSheet,
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
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
          <Image source={{ uri:this.props.imagePath }} resizeMode="contain" style={styles.postImage}/>
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
    backgroundColor: '#aaa',
  },
  postInfo: {
    flexDirection: 'row',
    alignItems: 'center',
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
    //flex: 1,
    flexDirection:'row',
    //alignItems: 'stretch',
  },
  postImage: {
    flexShrink: 1,
    //alignSelf: 'center',
    //padding: 0,
    //height: 320,
    //width: 240,
    //borderWidth: 3,
    //borderColor: '#e2e2e2',
    //borderRadius: 2,
    //marginBottom: 10,
    //backgroundColor: '#dddddd',
  },
})

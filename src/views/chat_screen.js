import React, { Component } from 'react'
import {
  Text,
  TextInput,
  View,
  StatusBar,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity
} from 'react-native'
import { getColor } from '../components/config'
import { firebaseApp } from '../firebase'
import Icon from 'react-native-vector-icons/Ionicons'
import EvilIcon from 'react-native-vector-icons/EvilIcons'
import { observer,inject } from 'mobx-react/native'
import { Actions } from 'react-native-mobx'


const screenWidth = Dimensions.get('window').width

@inject("appStore") @observer
export default class ChatScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errMsg: null,
    }
  }

  render() {
    const height = screenWidth*this.props.postProps.imageHeight/this.props.postProps.imageWidth
    return (
      <ScrollView style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>
            {this.props.postProps.postTitle}
          </Text>
          <Image
            source={{ uri:this.props.postProps.imagePath }}
            resizeMode='contain'
            style={{
              height: height,
              width: screenWidth,
              alignSelf: 'center',
              marginBottom: 10,
            }}
          />
          <View style={styles.postInfo}>
            <Icon name='md-arrow-dropright' size={15} color='rgba(0,0,0,.5)' style={styles.itemIcon}/>
            <Text style={styles.username}>
              {this.props.postProps.posterName}
            </Text>
            <Text style={styles.time}>
              {this.props.postProps.postTime}
            </Text>
          </View>
          <Text style={styles.content}>
            {this.props.postProps.postContent}
          </Text>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    marginTop: 56,
  },
  card: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e2e2e2',
    borderRadius: 2,
    backgroundColor: '#eee',
    padding: 10,
    margin: 5,
    //justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
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
})

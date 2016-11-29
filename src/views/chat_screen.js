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
import firebase from 'firebase'
import Icon from 'react-native-vector-icons/Ionicons'
import EvilIcon from 'react-native-vector-icons/EvilIcons'
import { observer,inject } from 'mobx-react/native'
import { Actions } from 'react-native-mobx'
import { GiftedChat } from 'react-native-gifted-chat'


const screenWidth = Dimensions.get('window').width

@inject("appStore") @observer
export default class ChatScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      messages: [],
    }
  }

  componentWillMount() {
    this._loadMessages((message) => {
      this.setState((previousState) => {
        return {
          messages: GiftedChat.append(previousState.messages, message),
        }
      })
    })
  }

  componentDidMount() {

  }

  componentWillUnmount() {
    firebaseApp.database().ref('messages').child(this.props.postProps.postId).off()
  }

  _loadMessages(callback) {
    const onReceive = (data) => {
      const message = data.val()
      callback({
        _id: data.key,
        text: message.text,
        createdAt: new Date(message.createdAt),
        user: {
          _id: message.user._id,
          name: message.user.name,
        },
      });
    };
    firebaseApp.database().ref('messages').child(this.props.postProps.postId).limitToLast(20).on('child_added', onReceive)
  }

  _onSend = (messages = []) => {
    for (let i = 0; i < messages.length; i++) {
      firebaseApp.database().ref('messages').child(this.props.postProps.postId).push({
        text: messages[i].text,
        user: messages[i].user,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
      })
    }
  }

  render() {
    return (
            <GiftedChat
              messages={this.state.messages}
              onSend={this._onSend}
              user={{
                _id: this.props.appStore.user.uid,
                name: this.props.postProps.posterName,
              }}
            />
          )
  }
}

const styles = StyleSheet.create({

})

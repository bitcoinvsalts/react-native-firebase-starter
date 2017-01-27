import React, { Component } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ListView,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native'
import _ from 'lodash'
import moment from 'moment'
import { firebaseApp } from '../../firebase'
import Icon from 'react-native-vector-icons/Ionicons'
import { getColor } from '../config'
import { observer,inject } from 'mobx-react/native'
import { Actions } from 'react-native-mobx'


@inject("appStore") @observer
export default class MyChats extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      isFinished: false,
      counter: 30,
      isEmpty: false,
      dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => true}),
    }
    this.data = []
    const uid = this.props.appStore.user.uid
    console.log("--------- MY CHATS --------- " + this.props.appStore.chat_count)
    firebaseApp.database().ref('user_chats/'+ uid +'/posts').orderByChild('updatedAt').limitToLast(this.state.counter).on('child_added',
    (snapshot) => {
      console.log("--------->>>> CHAT ADDED ");
      this.data.unshift( {id: snapshot.key, postData: snapshot.val()} )
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.data)
      })
      this.setState({ isLoading: false })
    })
    firebaseApp.database().ref('user_chats/'+ uid +'/posts').orderByChild('updatedAt').limitToLast(this.state.counter).on('child_changed',
    (snapshot) => {
      console.log("--------->>>> CHAT CHANGED TWICE, very weird bug !!!");
      this.data = this.data.filter((x) => x.id !== snapshot.key)
      this.data.unshift({id: snapshot.key, postData: snapshot.val()})
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.data)
      })
    })
  }

  componentDidMount() {
    console.log("--------- MY CHATS --------- ")
    if (this.props.appStore.chat_count === 0) {
      this.setState({ isEmpty: true })
      this.setState({ isLoading: false })
    }
  }

  componentDidUpdate() {
  }

  render() {
    console.log("MY CHAT RENDERING AGAIN!!!");
    return (
      <View style={styles.container}>
        <ListView
          automaticallyAdjustContentInsets={true}
          initialListSize={1}
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
          renderFooter={this._renderFooter}
          //onEndReached={this._onEndReached}
          onEndReachedThreshold={1}
        />
      </View>
    )
  }

  _renderRow = (data) => {
    const timeString = moment(data.postData.updatedAt).fromNow()
    const newMessageCounter = data.postData.new_messages ?
      <View style={styles.CounterContainer}><Text style={styles.counter}>{ data.postData.new_messages }</Text></View>
    : null
    return (
      <TouchableOpacity onPress={() => this._openChat(data.postData)}>
        <View style={styles.card}>
          <View style={styles.RawContainer}>
            <View style={styles.LeftContainer}><Text style={styles.title}>{ data.postData.title }</Text></View>
            <View style={styles.RightContainer}><Text style={styles.author}>{ data.postData.username }</Text></View>
          </View>
          <View style={styles.RawContainer}>
            <View style={styles.LeftContainer}><Text style={styles.info}>{ data.postData.price }</Text></View>
            { newMessageCounter }
          </View>
          <View style={styles.RawContainer}>
            <Text style={styles.info}>{timeString}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  _onEndReached = () => {
    if (!this.state.isEmpty && !this.state.isFinished && !this.state.isLoading) {
      this.setState({ counter: this.state.counter + 10 })
      this.setState({ isLoading: true })
      firebaseApp.database().ref('user_chats/'+ this.props.appStore.user.uid +'/posts').off()
      firebaseApp.database().ref('user_chats/'+ this.props.appStore.user.uid +'/posts').orderByChild('updatedAt').limitToLast(this.state.counter+10).on('value',
      (snapshot) => {
        console.log("---- USER CHATS RETRIEVED ----");
        if (_.toArray(snapshot.val()).length < this.state.counter) {
          this.setState({ isFinished: true })
          console.log("---- USER CHATS FINISHED !!!! ----")
        }
        if (snapshot.val()) {
          console.log(this.state.counter);
          this.setState({ isEmpty: false })
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(_.reverse(_.toArray(snapshot.val()))),
          })
        }
        this.setState({ isLoading: false })
      })
    }
  }

  _renderFooter = () => {
    if (this.state.isLoading) {
      return (
        <View style={styles.waitView}>
          <ActivityIndicator size='large'/>
        </View>
      )
    }
    if (this.state.isEmpty) {
      return (
        <View style={styles.waitView}>
          <Text>- Here will be the list of your chats -</Text>
        </View>
      )
    }
  }

  _openChat = (postData) => {
    Actions.chat({ title:postData.title, puid:postData.puid })
  }

  componentWillUnmount() {
    firebaseApp.database().ref('user_chats/'+ this.props.appStore.user.uid +'/posts').off()
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  RawContainer: {
    flexDirection: 'row',
    flex: 1,
    //borderWidth: 1,
  },
  LeftContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    //borderWidth: 1,
  },
  RightContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    //borderWidth: 1,
  },
  CounterContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    //borderWidth: 1,
    height: 23,
    width: 23,
    borderRadius: 90,
    marginRight: 25,
    backgroundColor: getColor(),
  },
  counter: {
    fontSize: 16,
    fontWeight: '200',
    color: '#FFF',
  },
  waitView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  card: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#999',
    margin: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 5,
    color: '#444',
  },
  author: {
    fontSize: 16,
    padding: 5,
  },
  info: {
    padding: 3,
    fontSize: 13,
  },

})

import React, { Component } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  LayoutAnimation,
  Platform,
  UIManager,
  RefreshControl
} from 'react-native'
import _ from 'lodash'
import moment from 'moment'
import { firebaseApp } from '../../firebase'
import Icon from 'react-native-vector-icons/Ionicons'
import EvilIcon from 'react-native-vector-icons/EvilIcons'
import { getColor } from '../config'
import { observer } from 'mobx-react/native'
import { Actions } from 'react-native-mobx'
import Post from './post'


@observer(['appStore'])
export default class Profile extends Component {
  constructor(props) {
    super(props)
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true)
    }
    this.state = {
      isRefreshing: false,
      updateNotification: 'Loading...'
    }
  }

  componentDidMount() {
    const uid = this.props.appStore.user.uid
    console.log("--------- MY POSTS --------- " + uid)
    firebaseApp.database().ref('users/'+ uid +'/posts').orderByChild('timestamp').limitToLast(30).once('value')
    .then((snapshot) => {
      this.props.appStore.myposts = snapshot.val()
      this.setState({ updateNotification: 'Pull to refresh...' })
    })
    .catch((error) => {
      console.error(error);
    })
  }

  componentDidUpdate() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
  }

  render() {
    const notify = this.state.updateNotification ?
    <Text style={styles.updateNotificationStyle}>
      {this.state.updateNotification}
    </Text>
    : null

    const view = this.props.appStore.myposts ?
      <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={this.state.isRefreshing}
          onRefresh={this._onRefresh}
          tintColor="#ff0000"
          title="Loading..."
          titleColor="#00ff00"
          colors={[getColor()]}
          progressBackgroundColor={getColor('#ffffff')}
        />
      }>
      {notify}
      {this._renderPosts()}
      </ScrollView>
    : null

    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.listItem} onPress={this._userEdit}>
          <EvilIcon name='pencil' size={30} color='rgba(0,0,0,.5)' style={styles.itemIcon}/>
          <Text style={styles.itemName}>
            Edit your account
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.listItem} onPress={this._logOut}>
          <Icon name='md-log-out' size={30} color='rgba(0,0,0,.5)' style={styles.itemIcon}/>
          <Text style={styles.itemName}>
            Sign Out - {this.props.appStore.username}
          </Text>
        </TouchableOpacity>
        {view}
      </View>
    )
  }

  _renderPosts = () => {
    console.log("--- render User Posts ---")
    const postArray = []
    _.forEach(this.props.appStore.myposts, (value, index) => {
      const timeString = moment(value.timestamp).fromNow()
      postArray.push(
        <Post
        postTitle={value.title}
        posterName={value.username}
        postTime={timeString}
        postContent={value.text}
        key={index}
        />
      )
    })
    _.reverse(postArray)
    return postArray
  }

  _userEdit = () => {
    Actions.setting()
  }

  _logOut = () => {
    firebaseApp.auth().signOut()
    .then(() => {
      Actions.login({ type: 'replace' });
    }, function(error) {
      console.log(error)
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  waitView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  updateNotificationStyle: {
    textAlign: 'center',
    marginTop: 10,
    paddingBottom: 5
  },
  listItem: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemIcon: {
    marginLeft: 20,
    marginRight: 20
  },
  itemName: {
    fontSize: 14
  }
})

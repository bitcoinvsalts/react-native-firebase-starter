import React, { Component } from 'react'
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  LayoutAnimation,
  Platform,
  UIManager,
  RefreshControl
} from 'react-native'
import _ from 'lodash'
import moment from 'moment'
import { inject, observer } from 'mobx-react/native'
import { getColor } from '../config'
import { firebaseApp } from '../../firebase'
import Post from './post'


@inject ('appStore') @observer
export default class Timeline extends Component {
  constructor(props) {
    super(props)
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true)
    }
    this.state = {
      isRefreshing: false,
      updateNotification: null
    }
  }

  componentDidMount() {
    console.log("--------- TIMELINE ---------timeline.js")
    firebaseApp.database().ref('posts').orderByChild('timestamp').limitToLast(30).once('value')
      .then((snapshot) => {
        debugger
        const val = snapshot.val()
        console.log('snapshot',val)
        this.props.appStore.posts = val
    })
    .catch((error) => {
      console.error(error);
    })
    setTimeout(() => {
      this.setState({ updateNotification: 'Pull to refresh...' })
    }, 1000)
  }

  componentDidUpdate() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
  }

  _onRefresh = () => {
    console.log("--------- REFRESHING ---------timeline.js");
    this.setState({ isRefreshing: true })
    firebaseApp.database().ref('posts/').orderByChild('timestamp').limitToLast(30).once('value')
      .then((snapshot) => {
        debugger
      this.props.appStore.posts = snapshot.val()
      this.setState({isRefreshing: false, updateNotification: null})
    })
  }

  render() {
    const notify = this.state.updateNotification ?
    <Text style={styles.updateNotificationStyle}>
      {this.state.updateNotification}
    </Text>
    : null

    const view = this.props.appStore.posts ?
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
    :
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
        <View style={styles.waitView}>
          <Text>Nothing there yet.</Text>
        </View>
      </ScrollView>

    return (
      <View style={styles.container}>
        {view}
      </View>
    )
  }

  _renderPosts = () => {
    console.log("--- renderPosts ---timeline.js")
    const postArray = []
    _.forEach(this.props.appStore.posts, (value, index) => {
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
  }
})

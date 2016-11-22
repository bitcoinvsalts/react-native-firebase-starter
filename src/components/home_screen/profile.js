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
import Post from './post'


@inject("appStore") @observer
export default class Profile extends Component {
  constructor(props) {
    super(props)
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true)
    }
    this.state = {
      isLoadingTail: true,
      isFinished: false,
      counter: 2,
      isEmpty: false,
      dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}),
    }
  }

  componentDidMount() {
    const uid = this.props.appStore.user.uid
    console.log("--------- MY POSTS --------- " + uid)
    firebaseApp.database().ref('userposts/'+ uid +'/posts').orderByChild('timestamp').limitToLast(this.state.counter).on('value',
    (snapshot) => {
      console.log("USER POST RETRIEVED");
      //this.props.appStore.myposts = snapshot.val()
      if (snapshot.val()) {
        this.setState({ isEmpty: false })
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(_.reverse(_.toArray(snapshot.val()))),
        })
      }
      else {
        this.setState({ isEmpty: true })
      }
      this.setState({ isLoadingTail: false })
    })
  }

  componentDidUpdate() {
    //LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.profileInfoContainer}>
          <View style={styles.profileNameContainer}>
            <Text style={styles.profileName}>
              {this.props.appStore.username}
            </Text>
          </View>
          <View style={styles.profileCountsContainer}>
            <Text style={styles.profileCounts}>
              {this.props.appStore.post_count}
            </Text>
            <Text style={styles.countsName}>
              POSTS
            </Text>
          </View>
          <View style={styles.profileCountsContainer}>
            <TouchableOpacity onPress={this._userEdit}>
              <Icon name='md-settings' size={30} color='rgba(255,255,255,.9)'/>
            </TouchableOpacity>
          </View>
          <View style={styles.profileCountsContainer}>
            <TouchableOpacity onPress={this._logOut}>
              <Icon name='md-log-out' size={30} color='rgba(255,255,255,.9)'/>
            </TouchableOpacity>
          </View>
        </View>

        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
          renderFooter={this._renderFooter}
          onEndReached={this._onEndReached}
        />
      </View>
    )
  }

  _renderRow = (data) => {
    console.log("--- _renderRow ---")
    const timeString = moment(data.timestamp).fromNow()
    return (
      <Post
        postTitle={data.title}
        posterName={data.username}
        postTime={timeString}
        postContent={data.text}
        imagePath={data.image}
        imageWidth={data.imageWidth}
        imageHeight={data.imageHeight}
      />
    )
  }

  _onEndReached = () => {
    if (!this.state.isEmpty && !this.state.isFinished) {
      console.log("--- _onEndReached --- " + this.state.counter)
      this.setState({ counter: this.state.counter + 1 })
      this.setState({ isLoadingTail: true })
      firebaseApp.database().ref('userposts/'+ this.props.appStore.user.uid +'/posts').off()
      firebaseApp.database().ref('userposts/'+ this.props.appStore.user.uid +'/posts').orderByChild('timestamp').limitToLast(this.state.counter).on('value',
      (snapshot) => {
        console.log("---- USER POST RETRIEVED ----");
        //this.props.appStore.posts = snapshot.val()
        if (_.toArray(snapshot.val()).length < this.state.counter) {
          this.setState({ isFinished: true })
          console.log("---- USER POST FINISHED !!!! ----")
        }
        if (snapshot.val()) {
          console.log(this.state.counter);
          this.setState({ isEmpty: false })
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(_.reverse(_.toArray(snapshot.val()))),
          })
        }
        this.setState({ isLoadingTail: false })
      })
    }
  }

  _renderFooter = () => {
    console.log("--- _renderFooter ---")
    if (this.state.isLoadingTail) {
      return (
        <View style={styles.waitView}>
          <ActivityIndicator size='large'/>
        </View>
      )
    }
    if (this.state.isEmpty) {
      return (
        <View style={styles.waitView}>
          <Text>Nothing there yet.</Text>
        </View>
      )
    }
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
  profileInfoContainer: {
    flexDirection: 'row',
    height: 65,
    margin: 5,
    borderRadius: 2,
    backgroundColor: getColor()
  },
  profileNameContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  profileName: {
    marginLeft: 10,
    fontFamily: 'Roboto-Bold',
    fontSize: 20,
    color: '#fff',
  },
  profileCountsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 5
  },
  profileCounts: {
    fontFamily: 'Roboto-Regular',
    fontSize: 30,
    color: '#fff'
  },
  countsName: {
    fontFamily: 'Roboto-Bold',
    fontSize: 12,
    color: '#ffffff'
  },
  waitView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
})

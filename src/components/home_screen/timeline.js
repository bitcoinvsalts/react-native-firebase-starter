import React, { Component } from 'react'
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  ListView,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native'
import _ from 'lodash'
import moment from 'moment'
import { observer,inject } from 'mobx-react/native'
import { getColor } from '../config'
import { firebaseApp } from '../../firebase'
import Post from './post'


@inject("appStore") @observer
export default class Timeline extends Component {
  constructor(props) {
    super(props)
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true)
    }
    this.state = {
      isLoadingTail: true,
      counter: 2,
      isEmpty: false,
      isFinished: false,
      dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}),
    }
  }

  componentDidMount() {
    console.log("--------- TIMELINE --------- " + this.state.counter)
    firebaseApp.database().ref('posts').orderByChild('timestamp').limitToLast(this.state.counter).on('value',
    (snapshot) => {
      console.log("---- TIMELINE POST RETRIEVED ---- "+ this.state.counter +" - "+ _.toArray(snapshot.val()).length)
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
        <ListView
          automaticallyAdjustContentInsets={true}
          initialListSize={6}
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
          renderFooter={this._renderFooter}
          onEndReached={this._onEndReached}
        />
      </View>
    )
  }

  _renderRow = (data) => {
    const timeString = moment(data.timestamp).fromNow()
    return (
      <Post key={data.puid}
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
      this.setState({ counter: this.state.counter + 1 })
      this.setState({ isLoadingTail: true })
      firebaseApp.database().ref('posts').off()
      firebaseApp.database().ref('posts').orderByChild('timestamp').limitToLast(this.state.counter+1).on('value',
      (snapshot) => {
        console.log("---- TIMELINE POST ON END RETRIEVED ---- "+ this.state.counter +" - "+ _.toArray(snapshot.val()).length)
        if (_.toArray(snapshot.val()).length < this.state.counter) {
          console.log("---- TIMELINE POST FINISHED ----");
          this.setState({ isFinished: true })
        }
        if (snapshot.val()) {
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
})

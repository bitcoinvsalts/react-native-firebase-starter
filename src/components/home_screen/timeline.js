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
import { observer } from 'mobx-react/native'
import { getColor } from '../config'
import { firebaseApp } from '../../firebase'
import Post from './post'


@observer(['appStore'])
export default class Timeline extends Component {
  constructor(props) {
    super(props)
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true)
    }
    this.state = {
      isLoadingTail: true,
      dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}),
    }
  }

  componentDidMount() {
    console.log("--------- TIMELINE --------- ")
    firebaseApp.database().ref('posts').orderByChild('timestamp').on('value',
    (snapshot) => {
      console.log("---- TIMELINE POST RETRIEVED ----");
      console.log(snapshot.val());
      //this.props.appStore.posts = snapshot.val()
      this.setState({ isLoadingTail: false })
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(_.reverse(_.toArray(snapshot.val()))),
      })
    })
  }

  componentDidUpdate() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
          renderFooter={this._renderFooter}
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
      />
    )
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

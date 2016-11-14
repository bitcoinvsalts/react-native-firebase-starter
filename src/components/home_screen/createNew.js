import React, { Component } from 'react'
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/Ionicons'
import { getColor } from '../config'
import { firebaseApp } from '../../firebase'
import { observer } from 'mobx-react/native'


@observer(['appStore'])
export default class CreateNew extends Component {
  constructor(props) {
    super(props)
    this.state = {
      postStatus: null,
      postText: '',
      postTitle: '',
    }
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true)
    }
  }

  componentDidUpdate() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          {'Add a new Post'.toUpperCase()}
        </Text>
        <KeyboardAwareScrollView>
        <View style={styles.titleContainer}>
          <TextInput
          style={styles.inputField}
          value={this.state.postTitle}
          onChangeText={(text) => this.setState({ postTitle: text })}
          underlineColorAndroid='transparent'
          placeholder='Enter a Post Title'
          placeholderTextColor='rgba(0,0,0,.6)'
          onSubmitEditing={(event) => {
            this.refs.SecondInput.focus();
          }}
          />
        </View>
        <TouchableOpacity style={styles.btnAdd} onPress={this._handleNewPost}>
          <Icon
            name={'md-add'}
            size={30}
            color={'#fff'}
          />
        </TouchableOpacity>
        <Text style={styles.message}>{this.state.postStatus}</Text>
        <View style={styles.inputContainer}>
          <TextInput
          ref='SecondInput'
          multiline={true}
          style={styles.inputField}
          underlineColorAndroid='transparent'
          placeholder='Please enter a Post Content'
          value={this.state.postText}
          onChangeText={(text) => this.setState({ postText: text })}
          placeholderTextColor='rgba(0,0,0,.6)'
          />
        </View>
        </KeyboardAwareScrollView>
      </View>
    )
  }

  _handleNewPost = () => {
    this.setState({
      postStatus: 'Posting...'
    })
    if (this.state.postTitle.length > 0) {
      if (this.state.postText.length > 0) {
        const uid = this.props.appStore.user.uid
        const username = this.props.appStore.user.displayName
        const timestamp = Date.now()
        const newPostKey = firebaseApp.database().ref('posts').push().key
        const postData = {
          username: username,
          timestamp: timestamp,
          text: this.state.postText,
          title: this.state.postTitle,
          puid: newPostKey
        }
        let updates = {}
        console.log("------> " + uid);
        updates['/posts/' + newPostKey] = postData
        updates['/users/' + uid + '/posts/' + newPostKey] = postData
        firebaseApp.database().ref().update(updates)
        .then(() => {
          this.setState({
                          postStatus: 'Posted! Thank You.',
                          postTitle: '',
                          postText: '',
                        })
        }).catch(() => {
          this.setState({ postStatus: 'Something went wrong!!!' })
        })
      } else {
        this.setState({ postStatus: 'Please enter a post content.' })
      }
    } else {
      this.setState({ postStatus: 'Please enter a post title.' })
    }
    setTimeout(() => {
      this.setState({ postStatus: null })
    }, 3000)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    flexDirection: 'column',
  },
  title: {
    marginTop: 10,
    paddingBottom: 10,
    fontSize: 15,
    textAlign: 'center',
    color: getColor()
  },
  message: {
    textAlign: 'center',
    paddingTop: 2,
    paddingBottom: 10
  },
  inputContainer: {
    flex: 1,
    height: 160,
    backgroundColor: 'rgba(255,255,255,.6)',
    marginBottom: 10,
    padding: 5,
    borderWidth: 1,
    borderColor: '#e2e2e2',
    borderRadius: 2,
  },
  titleContainer: {
    height: 40,
    width: 300,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,.6)',
    marginBottom: 10,
    padding: 5,
    borderWidth: 1,
    borderColor: '#e2e2e2',
    borderRadius: 2,
  },
  inputField: {
    flex: 1,
    width: 300,
    paddingLeft: 10,
    paddingTop: 4,
    paddingBottom: 4,
    fontSize: 14,
  },
  btnAdd: {
    width: 280,
    height: 40,
    backgroundColor: getColor(),
    borderRadius: 5,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
})

import React, { Component } from 'react'
import {
  Text,
  View,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ImagePicker from 'react-native-image-picker'
import RNFetchBlob from 'react-native-fetch-blob'
import Spinner from 'react-native-loading-spinner-overlay'
import Icon from 'react-native-vector-icons/Ionicons'
import { getColor } from '../config'
import { firebaseApp } from '../../firebase'
import { observer } from 'mobx-react/native'


const Blob = RNFetchBlob.polyfill.Blob
const fs = RNFetchBlob.fs
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = Blob

const uploadImage = (uri, imageName, mime = 'image/jpg') => {
  return new Promise((resolve, reject) => {
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
      let uploadBlob = null
      const imageRef = firebaseApp.storage().ref('posts').child(imageName)

      fs.readFile(uploadUri, 'base64')
      .then((data) => {
        return Blob.build(data, { type: `${mime};BASE64` })
      })
      .then((blob) => {
        uploadBlob = blob
        return imageRef.put(blob, { contentType: mime })
      })
      .then(() => {
        uploadBlob.close()
        return imageRef.getDownloadURL()
      })
      .then((url) => {
        resolve(url)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

@observer(['appStore'])
export default class CreateNew extends Component {
  constructor(props) {
    super(props)
    this.state = {
      postStatus: null,
      postText: '',
      postTitle: '',
      imagePath: null,
      spinnervisible: false,
    }
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true)
    }
  }

  componentDidUpdate() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
  }

  render() {
    const photo = this.state.imagePath ?
      <Image source={{uri: this.state.imagePath}} style={styles.postImage}/>
     :
      <Image source={require('../../assets/images/jsapp.png')} style={styles.postImage}/>

    return (
      <View style={styles.container}>
        <Spinner visible={this.state.spinnervisible} />
        <KeyboardAwareScrollView>
          <Text style={styles.title}>{'ADD A NEW POST'}</Text>
          { photo }
          <TouchableOpacity style={styles.btnAdd} onPress={this._takePicture}>
            <Icon
              name={'md-camera'}
              size={30}
              color={'#fff'}
            />
          </TouchableOpacity>
          <Text style={styles.message}>{this.state.postStatus}</Text>
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

  _takePicture = () => {
    const cam_options = {
      mediaType: 'photo',
      maxWidth: 1000,
      maxHeight: 1000,
      quality: 1,
      noData: true,
    };
    ImagePicker.launchCamera(cam_options, (response) => {
      if (response.didCancel) {
      }
      else if (response.error) {
      }
      else {
        this.setState({
          imagePath: response.uri
        })
      }
    })
  }

  _handleNewPost = () => {
    this.setState({
      postStatus: 'Posting...',
    })
    if (this.state.imagePath) {
      if (this.state.postTitle.length > 0) {
        if (this.state.postText.length > 0) {

          this.setState({ spinnervisible: true })
          const uid = this.props.appStore.user.uid
          const username = this.props.appStore.user.displayName
          const timestamp = Date.now()
          const newPostKey = firebaseApp.database().ref('posts').push().key
          const imageName = `${newPostKey}.jpg`

          uploadImage(this.state.imagePath, imageName)
          .then(url => {
            console.log("------> " + url);
            const postData = {
              username: username,
              timestamp: timestamp,
              text: this.state.postText,
              title: this.state.postTitle,
              puid: newPostKey,
              image: url,
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
                              imagePath: null,
                              spinnervisible: false,
                            })
              setTimeout(() => {
                this.setState({ postStatus: null })
              }, 3000)
            })
            .catch(() => {
              this.setState({ postStatus: 'Something went wrong!!!' })
              this.setState({ spinnervisible: false })
            })
          })
          .catch(error => {
            console.log(error)
            this.setState({ spinnervisible: false })
          })

        } else {
          this.setState({ postStatus: 'Please enter a post content.' })
        }
      } else {
        this.setState({ postStatus: 'Please enter a post title.' })
      }
    } else {
      this.setState({ postStatus: 'Please take a picture' })
    }
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
    marginTop: 5,
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
  postImage: {
    //flex: 1,
    alignSelf: 'center',
    height: 320,
    width: 240,
    borderWidth: 3,
    borderColor: '#e2e2e2',
    borderRadius: 2,
    marginBottom: 10,
    backgroundColor: '#dddddd',
  },
})

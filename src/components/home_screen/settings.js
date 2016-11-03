/**
 * the settings tab
 */

import React, { Component } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  StyleSheet
} from 'react-native'
import { connect } from 'react-redux'
import { firebaseApp } from '../../firebase'
import Icon from 'react-native-vector-icons/Ionicons'

class Settings extends Component {
  constructor(props) {
    super(props)

    this.state = {
      username: '',
      email: '',
      signOutMsg: 'Sign Out'
    }
  }

  componentDidMount() {
    const user = this.props.currentUser
    this.setState({
      username: user.name,
      email: user.email,
    })
  }

  render() {
    return (
      <View>
        <TouchableOpacity style={styles.listItem} onPress={this._logOut}>
          <Icon name='md-log-out' size={30} color='rgba(0,0,0,.5)' style={styles.itemIcon}/>
          <Text style={styles.itemName}>
            {this.state.signOutMsg} - {this.state.username}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  _logOut = () => {
    this.props.onLogOut()
  }
}

const styles = StyleSheet.create({
  listItem: {
    marginTop: 10,
    height: 50,
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

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser
  }
}
export default connect(mapStateToProps)(Settings)

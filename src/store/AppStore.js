import { observable, action, autorun, computed } from 'mobx'
import { Actions } from 'react-native-mobx'
//import { persist } from 'mobx-persist'


class AppStore {
  @observable userid = null
  @observable username = ''
  @observable posts = []
}

const appStore = new AppStore()

autorun(() => {
  console.log(appStore)
})

export default appStore

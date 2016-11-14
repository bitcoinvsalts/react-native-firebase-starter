import { observable, autorun } from 'mobx'

class AppStore {
  @observable username = ''
  @observable user = {}
  @observable posts = []
}

const appStore = new AppStore()

autorun(() => {
  console.log(appStore)
})

export default appStore

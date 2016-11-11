import { observable, autorun } from 'mobx'

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

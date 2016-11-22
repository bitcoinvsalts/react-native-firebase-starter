import { observable, autorun } from 'mobx'

class AppStore {
  @observable username = ''
  @observable user = {}
  @observable post_count = 0
  //@observable posts = []
  //@observable myposts = []
}

const appStore = new AppStore()

autorun(() => {
  console.log(appStore)
})

export default appStore
